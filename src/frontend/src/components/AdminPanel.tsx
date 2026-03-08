import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, type Player, type Role } from "../backend";
import {
  useAddPlayer,
  useAllPlayers,
  useRemovePlayer,
  useTeamProfile,
  useUpdatePlayer,
  useUpdateTeamProfile,
} from "../hooks/useQueries";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS = [
  { value: "batsman", label: "Batsman" },
  { value: "bowler", label: "Bowler" },
  { value: "allRounder", label: "All-Rounder" },
  { value: "wicketKeeper", label: "Wicket-Keeper" },
];

function makeRole(kind: string): Role {
  switch (kind) {
    case "batsman":
      return { __kind__: "batsman", batsman: {} };
    case "bowler":
      return { __kind__: "bowler", bowler: {} };
    case "allRounder":
      return { __kind__: "allRounder", allRounder: {} };
    case "wicketKeeper":
      return { __kind__: "wicketKeeper", wicketKeeper: {} };
    default:
      return { __kind__: "batsman", batsman: {} };
  }
}

function PhotoUploader({
  currentUrl,
  onUpload,
  ocid,
  label = "Upload Photo",
}: {
  currentUrl?: string;
  onUpload: (blob: ExternalBlob, preview: string) => void;
  ocid: string;
  label?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
        if (pct >= 100) setTimeout(() => setUploadProgress(null), 600);
      });
      onUpload(blob, previewUrl);
    },
    [onUpload],
  );

  const uploadId = `upload-${ocid}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={uploadId} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <label
        htmlFor={uploadId}
        className="relative w-full aspect-[3/2] rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-muted flex items-center justify-center"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Upload className="w-6 h-6" />
            <span className="text-xs text-center px-2">
              Click to upload image
            </span>
          </div>
        )}
        {uploadProgress !== null && (
          <div className="absolute inset-x-0 bottom-0 p-2 bg-background/80 backdrop-blur-sm">
            <Progress value={uploadProgress} className="h-1.5" />
          </div>
        )}
        <input
          id={uploadId}
          data-ocid={ocid}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
    </div>
  );
}

// ─── Team Profile Form ─────────────────────────────────────
function TeamProfileForm() {
  const { data: teamProfile } = useTeamProfile();
  const updateProfile = useUpdateTeamProfile();

  const [name, setName] = useState(teamProfile?.name ?? "");
  const [tagline, setTagline] = useState(teamProfile?.tagline ?? "");
  const [about, setAbout] = useState(teamProfile?.about ?? "");
  const [logoBlobState, setLogoBlobState] = useState<ExternalBlob | null>(
    teamProfile?.logo ?? null,
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    teamProfile?.logo?.getDirectURL() ?? null,
  );

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Team name is required");
      return;
    }

    const logo =
      logoBlobState ??
      (teamProfile?.logo
        ? teamProfile.logo
        : ExternalBlob.fromURL(
            "/assets/generated/cricket-logo-placeholder-transparent.png",
          ));

    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        tagline: tagline.trim(),
        about: about.trim(),
        logo,
      });
      toast.success("Team profile updated!");
    } catch {
      toast.error("Failed to update team profile");
    }
  };

  return (
    <div className="space-y-5 p-1">
      <PhotoUploader
        currentUrl={logoPreview ?? undefined}
        onUpload={(blob, preview) => {
          setLogoBlobState(blob);
          setLogoPreview(preview);
        }}
        ocid="logo.upload_button"
        label="Team Logo"
      />
      <div className="space-y-2">
        <Label htmlFor="team-name">Team Name</Label>
        <Input
          data-ocid="admin.team_name.input"
          id="team-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rising Stars CC"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="team-tagline">Tagline</Label>
        <Input
          data-ocid="admin.team_tagline.input"
          id="team-tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="e.g. Playing with heart, winning with grace."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="team-about">About</Label>
        <Textarea
          data-ocid="admin.team_about.textarea"
          id="team-about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Tell your team's story…"
          className="min-h-[120px] resize-y"
        />
      </div>
      <Button
        data-ocid="admin.save_button"
        onClick={handleSave}
        disabled={updateProfile.isPending}
        className="w-full"
      >
        {updateProfile.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {updateProfile.isPending ? "Saving…" : "Save Team Profile"}
      </Button>
    </div>
  );
}

// ─── Player Form (Add / Edit) ──────────────────────────────
interface PlayerFormData {
  name: string;
  role: string;
  jerseyNumber: string;
  bio: string;
  photoBlob: ExternalBlob | null;
  photoPreview: string | null;
}

function PlayerForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Partial<PlayerFormData>;
  onSave: (data: PlayerFormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<PlayerFormData>({
    name: initial?.name ?? "",
    role: initial?.role ?? "batsman",
    jerseyNumber: initial?.jerseyNumber ?? "",
    bio: initial?.bio ?? "",
    photoBlob: initial?.photoBlob ?? null,
    photoPreview: initial?.photoPreview ?? null,
  });

  const update = (key: keyof PlayerFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <PhotoUploader
        currentUrl={form.photoPreview ?? undefined}
        onUpload={(blob, preview) => {
          update("photoBlob", blob);
          update("photoPreview", preview);
        }}
        ocid="player.upload_button"
        label="Player Photo"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label>Full Name</Label>
          <Input
            data-ocid="admin.player_name.input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Virat Sharma"
            disabled={!!initial?.name}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select value={form.role} onValueChange={(v) => update("role", v)}>
            <SelectTrigger data-ocid="admin.player_role.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Jersey #</Label>
          <Input
            data-ocid="admin.player_jersey.input"
            type="number"
            min={0}
            max={99}
            value={form.jerseyNumber}
            onChange={(e) => update("jerseyNumber", e.target.value)}
            placeholder="e.g. 18"
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Bio (optional)</Label>
          <Textarea
            data-ocid="admin.player_bio.textarea"
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="Brief description of the player…"
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={saving}
          data-ocid="admin.cancel_button"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          className="flex-1"
          disabled={saving}
          data-ocid="admin.save_button"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : "Save Player"}
        </Button>
      </div>
    </div>
  );
}

// ─── Players Manager Tab ──────────────────────────────────
function PlayersManager() {
  const { data: players = [], isLoading } = useAllPlayers();
  const addPlayer = useAddPlayer();
  const updatePlayer = useUpdatePlayer();
  const removePlayer = useRemovePlayer();

  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAdd = async (data: PlayerFormData) => {
    if (!data.name.trim()) {
      toast.error("Player name is required");
      return;
    }
    const jersey = Number.parseInt(data.jerseyNumber, 10);
    if (Number.isNaN(jersey) || jersey < 0) {
      toast.error("Valid jersey number required");
      return;
    }
    const photo =
      data.photoBlob ??
      ExternalBlob.fromURL(
        "/assets/generated/player-avatar-placeholder-transparent.png",
      );

    try {
      await addPlayer.mutateAsync({
        name: data.name.trim(),
        role: makeRole(data.role),
        jerseyNumber: BigInt(jersey),
        bio: data.bio.trim(),
        photo,
      });
      toast.success(`${data.name} added to the squad!`);
      setMode("list");
    } catch {
      toast.error("Failed to add player");
    }
  };

  const handleUpdate = async (data: PlayerFormData) => {
    if (!editingPlayer) return;
    const jersey = Number.parseInt(data.jerseyNumber, 10);
    if (Number.isNaN(jersey) || jersey < 0) {
      toast.error("Valid jersey number required");
      return;
    }
    const photo = data.photoBlob ?? editingPlayer.photo;
    try {
      await updatePlayer.mutateAsync({
        name: editingPlayer.name,
        role: makeRole(data.role),
        jerseyNumber: BigInt(jersey),
        bio: data.bio.trim(),
        photo,
      });
      toast.success(`${editingPlayer.name} updated!`);
      setMode("list");
      setEditingPlayer(null);
    } catch {
      toast.error("Failed to update player");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removePlayer.mutateAsync(deleteTarget);
      toast.success(`${deleteTarget} removed from the squad.`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to remove player");
    }
  };

  if (mode === "add") {
    return (
      <div className="space-y-4 p-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("list")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-display font-semibold text-base">Add Player</h3>
        </div>
        <PlayerForm
          onSave={handleAdd}
          onCancel={() => setMode("list")}
          saving={addPlayer.isPending}
        />
      </div>
    );
  }

  if (mode === "edit" && editingPlayer) {
    return (
      <div className="space-y-4 p-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("list");
              setEditingPlayer(null);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-display font-semibold text-base">
            Edit: {editingPlayer.name}
          </h3>
        </div>
        <PlayerForm
          initial={{
            name: editingPlayer.name,
            role: editingPlayer.role.__kind__,
            jerseyNumber: editingPlayer.jerseyNumber.toString(),
            bio: editingPlayer.bio,
            photoPreview: editingPlayer.photo?.getDirectURL(),
          }}
          onSave={handleUpdate}
          onCancel={() => {
            setMode("list");
            setEditingPlayer(null);
          }}
          saving={updatePlayer.isPending}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-1">
      <Button
        data-ocid="admin.add_button"
        onClick={() => setMode("add")}
        className="w-full gap-2"
        variant="outline"
      >
        <Plus className="w-4 h-4" />
        Add New Player
      </Button>

      {isLoading && (
        <div data-ocid="admin.loading_state" className="space-y-2">
          {(["s1", "s2", "s3"] as const).map((k) => (
            <div key={k} className="h-14 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && players.length === 0 && (
        <div
          data-ocid="admin.players.empty_state"
          className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-lg"
        >
          No players yet. Add your first player above.
        </div>
      )}

      <div className="space-y-2">
        {players.map((player, i) => (
          <div
            key={player.name}
            data-ocid={`players.item.${i + 1}`}
            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
              <img
                src={
                  player.photo?.getDirectURL() ??
                  "/assets/generated/player-avatar-placeholder-transparent.png"
                }
                alt={player.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/assets/generated/player-avatar-placeholder-transparent.png";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-foreground truncate">
                {player.name}
              </div>
              <div className="text-xs text-muted-foreground">
                #{player.jerseyNumber.toString()} ·{" "}
                {ROLE_OPTIONS.find((r) => r.value === player.role.__kind__)
                  ?.label ?? player.role.__kind__}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                data-ocid={`admin.edit_button.${i + 1}`}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingPlayer(player);
                  setMode("edit");
                }}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                data-ocid={`admin.delete_button.${i + 1}`}
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(player.name)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Remove Player</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{deleteTarget}</strong>{" "}
              from the squad? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              data-ocid="admin.cancel_button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.confirm_button"
              variant="destructive"
              onClick={handleDelete}
              disabled={removePlayer.isPending}
            >
              {removePlayer.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Admin Panel Shell ────────────────────────────────────
export function AdminPanel({ open, onClose }: AdminPanelProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        data-ocid="admin.panel"
        side="right"
        className="w-full sm:max-w-md overflow-y-auto p-6"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-xl">
            Team Management
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="team">
          <TabsList className="w-full mb-6">
            <TabsTrigger
              value="team"
              data-ocid="admin.team_tab.tab"
              className="flex-1"
            >
              Team Profile
            </TabsTrigger>
            <TabsTrigger
              value="players"
              data-ocid="admin.players_tab.tab"
              className="flex-1"
            >
              Players
            </TabsTrigger>
          </TabsList>

          <Separator className="mb-6" />

          <TabsContent value="team">
            <TeamProfileForm />
          </TabsContent>

          <TabsContent value="players">
            <PlayersManager />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
