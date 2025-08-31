// storage/offlineGameStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
// If you don't have a UUID lib yet, install one. Examples:
// - nanoid/non-secure  -> npm i nanoid
// - react-native-uuid  -> npm i react-native-uuid
import { nanoid } from "nanoid/non-secure";
import type { LocalGame, LocalPlayer } from "../types/offline";

const K = {
  index: "ga:index", // JSON string[] of game ids
  currentGameId: "ga:currentGame", // string
  game: (id: string) => `ga:game:${id}`,
};

async function getIndex(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(K.index);
  return raw ? (JSON.parse(raw) as string[]) : [];
}
async function setIndex(ids: string[]) {
  await AsyncStorage.setItem(K.index, JSON.stringify(ids));
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
    status: "IN_PROGRESS",
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

export async function completeOfflineGame(gameId: string) {
  const game = await getOfflineGame(gameId);
  if (!game) return null;
  game.status = "COMPLETED";
  game.endedAt = new Date().toISOString();
  await AsyncStorage.setItem(K.game(gameId), JSON.stringify(game));

  // Clear current if this was the active one
  const current = await AsyncStorage.getItem(K.currentGameId);
  if (current === gameId) {
    await AsyncStorage.removeItem(K.currentGameId);
  }
  return game;
}
