import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Player, Role, TeamProfile } from "../backend";
import { useActor } from "./useActor";

// ─── Team Profile ─────────────────────────────────────────
export function useTeamProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<TeamProfile | null>({
    queryKey: ["teamProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTeamProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateTeamProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: TeamProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateTeamProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamProfile"] });
    },
  });
}

// ─── Players ──────────────────────────────────────────────
export function useAllPlayers() {
  const { actor, isFetching } = useActor();
  return useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayersSortedByJerseyNumber();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlayersByRole(role: Role) {
  const { actor, isFetching } = useActor();
  return useQuery<Player[]>({
    queryKey: ["players", "role", role.__kind__],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlayersByRole(role);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (player: Player) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addPlayer(player);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
}

export function useUpdatePlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (player: Player) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updatePlayer(player);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
}

export function useRemovePlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.removePlayer(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
}

// ─── Admin / Role ─────────────────────────────────────────
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
