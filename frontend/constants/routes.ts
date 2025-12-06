export const ROUTES = {
    HOME: "/(home)/home",
    GAME: "/(game)/game",
    GAME_INFO: "/(game)/gameInfoScreen",
    SETTINGS: "/settings",
    LOGIN: "/(auth)/login",
    SIGNUP: "/(auth)/signup",
    INDEX: "/",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
