export type LocalPlayer = {
  id: string; // local-only id
  displayName: string;
  userId?: string | null; // if logged-in, else undefined
  order: number; // tee order
  isOwner?: boolean;
};

export type LocalGame = {
  id: string; // clientId (ulid/uuid)
  totalHoles: number;
  startedAt: string; // ISO
  endedAt?: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  teeTime?: string; // ISO
  courseName?: string;

  players: LocalPlayer[];
  // strokes[i] = strokes for hole i+1 (null = not played yet)
  strokesByPlayer: Record<string, (number | null)[]>;
};
