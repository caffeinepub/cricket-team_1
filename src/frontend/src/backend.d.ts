import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Player {
    bio: string;
    name: string;
    role: Role;
    jerseyNumber: bigint;
    photo: ExternalBlob;
}
export interface RoleInfo {
}
export interface TeamProfile {
    about: string;
    tagline: string;
    logo: ExternalBlob;
    name: string;
}
export type Role = {
    __kind__: "allRounder";
    allRounder: RoleInfo;
} | {
    __kind__: "bowler";
    bowler: RoleInfo;
} | {
    __kind__: "wicketKeeper";
    wicketKeeper: RoleInfo;
} | {
    __kind__: "batsman";
    batsman: RoleInfo;
};
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPlayer(player: Player): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllPlayersSortedByJerseyNumber(): Promise<Array<Player>>;
    getAllPlayersSortedByName(): Promise<Array<Player>>;
    getCallerUserRole(): Promise<UserRole>;
    getPlayer(name: string): Promise<Player | null>;
    getPlayersByRole(role: Role): Promise<Array<Player>>;
    getTeamProfile(): Promise<TeamProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removePlayer(name: string): Promise<void>;
    updatePlayer(player: Player): Promise<void>;
    updateTeamProfile(profile: TeamProfile): Promise<void>;
}
