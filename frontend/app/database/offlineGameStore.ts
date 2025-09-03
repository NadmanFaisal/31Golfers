import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";
import type { LocalGame, LocalPlayer } from "../types/offline";

import { postCompletedGame } from "../api/game";

const K = {
  index: "ga:index", // JSON string[] of game ids
  currentGameId: "ga:currentGame", // string
  game: (id: string) => `ga:game:${id}`,
};

const PENDING = "ga:pendingComplete";

async function getIndex(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(K.index);
  return raw ? (JSON.parse(raw) as string[]) : [];
}
async function setIndex(ids: string[]) {
  await AsyncStorage.setItem(K.index, JSON.stringify(ids));
}

async function getPending(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(PENDING);
  return raw ? JSON.parse(raw) : [];
}
async function addPending(gameId: string) {
  const ids = await getPending();
  if (!ids.includes(gameId)) {
    ids.push(gameId);
    await AsyncStorage.setItem(PENDING, JSON.stringify(ids));
  }
}
async function removePending(gameId: string) {
  const ids = await getPending();
  const next = ids.filter((id) => id !== gameId);
  await AsyncStorage.setItem(PENDING, JSON.stringify(next));
}

export async function createOfflineGame({
  totalHoles,
  playerNames, // string[]
  ownerName, // string
  teeTime, // Date | undefined
  courseName, // string | undefined
  createdUserId, // string | undefined (if logged in)
}: {
  totalHoles: number;
  playerNames: string[]; // include owner in this list
  ownerName: string;
  teeTime?: Date;
  courseName?: string;
  createdUserId?: string;
}): Promise<LocalGame> {
  const id = nanoid();
  const startedAt = new Date().toISOString();

  // Build players (owner first)
  const uniqueNames = playerNames.filter(Boolean);
  const players: LocalPlayer[] = uniqueNames.map((name, i) => ({
    id: nanoid(),
    displayName: name,
    userId: name === ownerName ? (createdUserId ?? undefined) : undefined,
    order: i,
    isOwner: name === ownerName,
  }));

  // Empty strokes
  const empty = Array.from({ length: totalHoles }, () => null as number | null);
  const strokesByPlayer = Object.fromEntries(
    players.map((p) => [p.id, empty.slice()]),
  );

  const game: LocalGame = {
    id,
    totalHoles,
    startedAt,
    teeTime: teeTime ? teeTime.toISOString() : undefined,
    courseName,
    players,
    strokesByPlayer,
  };

  // Persist
  const [ids] = await Promise.all([
    getIndex(),
    AsyncStorage.setItem(K.game(id), JSON.stringify(game)),
  ]);
  if (!ids.includes(id)) {
    ids.unshift(id);
    await setIndex(ids);
  }
  await AsyncStorage.setItem(K.currentGameId, id);

  return game;
}

export async function getOfflineGame(id: string): Promise<LocalGame | null> {
  const raw = await AsyncStorage.getItem(K.game(id));
  return raw ? (JSON.parse(raw) as LocalGame) : null;
}

export async function getCurrentOfflineGame(): Promise<LocalGame | null> {
  const id = await AsyncStorage.getItem(K.currentGameId);
  return id ? getOfflineGame(id) : null;
}

export async function setStrokeOffline({
  gameId,
  playerId,
  holeNumber, // 1..N
  strokes,
}: {
  gameId: string;
  playerId: string;
  holeNumber: number;
  strokes: number;
}) {
  const game = await getOfflineGame(gameId);
  if (!game) throw new Error("Game not found");
  const arr = game.strokesByPlayer[playerId];
  if (!arr) throw new Error("Player not found");
  const idx = holeNumber - 1;
  if (idx < 0 || idx >= game.totalHoles) throw new Error("Hole out of range");
  arr[idx] = strokes;

  // Save back
  await AsyncStorage.setItem(K.game(gameId), JSON.stringify(game));

  // (Optional) enqueue for sync:
  // await enqueueOutbox({ type: "SET_STROKE", gameId, playerId, holeNumber, strokes, at: Date.now() });
  return game;
}

export async function completeOfflineGame(gameId: string, token: string) {
  const game = await getOfflineGame(gameId);
  if (!game) return null;
  game.endedAt = new Date().toISOString();
  await AsyncStorage.setItem(K.game(gameId), JSON.stringify(game));

  // Clear current if this was the active one
  const current = await AsyncStorage.getItem(K.currentGameId);
  if (current === gameId) {
    await AsyncStorage.removeItem(K.currentGameId);
  }

  syncCurrentGameWithBackend(gameId, token);
  return game;
}

export async function syncCurrentGameWithBackend(
  gameId: string,
  token: string,
) {
  // Sync the offline game with the backend
  try {
    const game = await getOfflineGame(gameId);
    if (!game || !game.endedAt) throw new Error("Game not ready");
    const response = await postCompletedGame(game, token);
    // On success, clear local copy (if that’s your policy)
    if (response.status === 200) {
      await AsyncStorage.removeItem(K.game(gameId));
      // Also ensure it isn’t in pending
      await removePending(gameId);
    }
  } catch {
    alert("Currently offline. Come back online to sync progress with cloud.");
    await addPending(gameId);
  }
}
