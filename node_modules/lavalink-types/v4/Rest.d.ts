import { Exception, Track, Stats } from "./Shared";
import { Player, Filters, VoiceState } from "./Player";

export type ErrorResponse = {
	timestamp: number;
	status: number;
	error: string;
	trace?: string;
	message: string;
	path: string;
}

export type GetPlayersResult = Array<Player>;

export type GetPlayerResult = Player;

export type UpdatePlayerData = {
	track?: UpdatePlayerTrack;
	position?: number;
	endTime?: number | null;
	volume?: number;
	paused?: boolean;
	filters?: Filters;
	voice?: VoiceState;
}

type BaseUpdatePlayerTrack = {
	userData?: Record<any, any>;
}

export type UpdatePlayerTrack = (BaseUpdatePlayerTrack & { encoded?: string | null }) | (BaseUpdatePlayerTrack & { identifier?: string });

export type UpdatePlayerResult = Player;

export type DestroyPlayerResult = void;

export type UpdateSessionData = {
	resuming?: boolean;
	timeout?: number;
}

export type UpdateSessionResult = Required<UpdateSessionData>;

type TrackLoadingResultBase<T extends LoadType, D> = {
	loadType: T;
	data: D;
}

export type LoadType = "track" | "playlist" | "search" | "empty" | "error"

export type TrackLoadingResult = TrackLoadingResultBase<"track", Track>
	| TrackLoadingResultBase<"playlist", TrackLoadingDataPlaylist>
	| TrackLoadingResultBase<"search", Array<Track>>
	| TrackLoadingResultBase<"empty", {}>
	| TrackLoadingResultBase<"error", Exception>;

export type TrackLoadingDataPlaylist = {
	info: PlaylistInfo;
	pluginInfo: Record<any, any>;
	tracks: Array<Track>;
}

export type PlaylistInfo = {
	name: string;
	selectedTrack: number;
}

export type DecodeTrackResult = Track;

export type DecodeTracksResult = Array<Track>;

export type LavalinkInfo = {
	version: LavalinkVersion;
	buildTime: number;
	git: LavalinkGit;
	jvm: string;
	lavaplayer: string;
	sourceManagers: Array<string>;
	filters: Array<string>;
	plugins: Array<PluginMeta>;
}

export type LavalinkVersion = {
	semver: string;
	major: number;
	minor: number;
	patch: number;
	preRelease: string | null;
	build: string | null;
}

export type LavalinkGit = {
	branch: string;
	commit: string;
	commitTime: number;
}

export type PluginMeta = {
	name: string;
	version: string;
}

export type GetLavalinkInfoResult = LavalinkInfo;

export type GetLavalinkStatsResult = Omit<Stats, "frameStats">;

export type GetLavalinkVersionResult = string;
