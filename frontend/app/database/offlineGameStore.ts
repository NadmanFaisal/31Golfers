import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";
import type { LocalGame, LocalPlayer } from "../types/offline";

import { postCompletedGame } from "../api/game";

const K = {
  index: "ga:index",
  currentGameId: "ga:currentGame",
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
  playerNames,
  ownerName,
  teeTime,
  courseName,
  createdUserId,
}: {
  totalHoles: number;
  playerNames: string[];
  ownerName: string;
  teeTime: Date;
  courseName: string;
  createdUserId: string;
}): Promise<LocalGame> {
  const id = nanoid();
  const startedAt = new Date().toISOString();

  // Build players (owner first)
  const uniqueNames = playerNames.filter(Boolean);
  const players: LocalPlayer[] = uniqueNames.map((name, i) => ({
    id: nanoid(),
    displayName: name,
    userId: name === ownerName ? createdUserId : undefined,
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
    teeTime: teeTime.toISOString(),
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
  holeNumber,
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

  return game;
}

async function flushPendingCompletedGames(token: string, realUserId?: string) {
  // If guest, do not attempt to sync with backend.
  if (token === "GUEST") {
    console.log("[OfflineStore] Guest user, skipping sync of pending games.");
    return;
  }

  const ids = await getPending();
  if (ids.length === 0) return;

  for (const id of [...ids]) {
    await syncCurrentGameWithBackend(id, token, realUserId);
  }
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

  await addPending(gameId);
  await flushPendingCompletedGames(token);

  // Check if the game is still pending to determine if sync was successful
  const pending = await getPending();
  const synced = !pending.includes(gameId);

  return { game, synced };
}

async function syncCurrentGameWithBackend(gameId: string, token: string, realUserId?: string) {
  // Sync the offline game with the backend
  try {
    const game = await getOfflineGame(gameId);
    if (!game || !game.endedAt) throw new Error("Game not ready");

    // If we have a real user ID (from login sync), associate the owner player with it
    if (realUserId) {
      console.log(`[Sync] Updating game ${gameId} with realUserID: ${realUserId}`);
      let ownerFound = false;
      game.players = game.players.map(p => {
        // Update if owner, OR if the userID is explicitly the placeholder "GUEST"
        if (p.isOwner || p.userId === "GUEST") {
          ownerFound = true;
          console.log(`[Sync] Found owner/guest player: ${p.displayName}. Updating ID.`);
          return { ...p, userId: realUserId, isOwner: true };
        }
        return p;
      });

      // Safety net: If no owner found (rare bugs?), assign first player
      if (!ownerFound && game.players.length > 0) {
        console.warn("[Sync] No owner found in guest game, assigning first player as owner.");
        game.players[0] = { ...game.players[0], isOwner: true, userId: realUserId };
      }
    } else {
      console.warn("[Sync] No realUserId provided for sync!");
    }

    const response = await postCompletedGame(game, token);
    // On success, clear local copy (if that’s your policy)
    if (response.status === 200) {
      console.log(`[Sync] Game ${gameId} synced successfully. Deleting local copy.`);
      await AsyncStorage.removeItem(K.game(gameId));
      // Also ensure it isn’t in pending
      await removePending(gameId);
    }
  } catch (e) {
    console.warn("Sync failed for game " + gameId, e);
    await addPending(gameId);
  }
}
// Exposed function to CLEAR guest data on login (User requested to delete instead of sync)
export async function clearOfflineGames() {
  console.log("[OfflineStore] Clearing offline games...");
  const ids = await getPending();
  for (const id of ids) {
    await AsyncStorage.removeItem(K.game(id));
  }
  // Clear pending list
  await AsyncStorage.removeItem(PENDING);
  // Also clear index if we want to be thorough, but pending covers "completed" games.
  // "Current" game is handled by specific key.
  await AsyncStorage.removeItem(K.currentGameId);

  // Clear the main index of games?
  // The history hook reads from 'K.index' or pending?
  // 'getIndex' reads 'K.index'. 'createOfflineGame' updates 'K.index'.
  // So to fully clear history:
  const allGameIds = await getIndex();
  for (const id of allGameIds) {
    await AsyncStorage.removeItem(K.game(id));
  }
  await AsyncStorage.removeItem(K.index);

  console.log("[OfflineStore] Offline games cleared.");
}

// Kept for reference but unused now (or used by login.tsx to clear)
export async function syncOfflineGamesPayload(token: string, userId: string) {
  // Guest transition: clear data
  await clearOfflineGames();
}

// NEW: For authenticated users to sync their offline games when they come online
export async function retrySyncPendingGames(token: string, userId: string) {
  if (!token || token === "GUEST") return;
  console.log("[OfflineStore] Retrying sync for pending games...");
  // We pass userId just in case, though for logged-in users creating games,
  // the game should already have the correct userId. 
  // The sync logic will only overwrite if it sees "GUEST" or isOwner.
  // So it's safe.
  await flushPendingCompletedGames(token, userId);
}

// Fetch all pending games with their full data
export async function getPendingGames(): Promise<LocalGame[]> {
  const ids = await getPending();
  const games = await Promise.all(ids.map(id => getOfflineGame(id)));
  // Filter out any nulls in case of corruption
  return games.filter((g): g is LocalGame => g !== null);
}

// Function to upload a specific game *just in case* it wasn't marked pending but exists
// Or used for "Guest" games that are technically "Current" but need to be saved to backend now?
// Actually, 'flushPendingCompletedGames' syncs *completed* games.
// The user requirement says "games stored in the offline database will be synched".
// This likely implies *completed* games that were played offline.
// If there is an *active* offline game, it might remain local until finished?
// Let's assume standard "flushPending" is what we want.
