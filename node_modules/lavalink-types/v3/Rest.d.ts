import { Exception, Track, Stats } from "./Shared";
import { Player, Filters, VoiceState } from "./Player";
import { RequiredInChild, NullChild } from "./Utilities";

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

type BaseUpdatePlayerData = {
	position?: number;
	endTime?: number;
	volume?: number;
	paused?: boolean;
	filters?: Filters;
	voice?: Omit<VoiceState, "connected" | "ping">;
}

export type UpdatePlayerData = (BaseUpdatePlayerData & { encodedTrack?: string | null; }) | (BaseUpdatePlayerData & { identifier?: string; });

export type UpdatePlayerResult = RequiredInChild<Player, "voice">;

export type DestroyPlayerResult = void;

export type UpdateSessionData = {
	resumingKey?: string | null;
	timeout?: number;
}

export type UpdateSessionResult = Required<UpdateSessionData>;

export type TrackLoadingResult = {
	tracks: Array<Track>;
	loadType: LoadType;
	playlistInfo?: PlaylistInfo;
	exception?: Exception;
}

export type LoadType = "TRACK_LOADED" | "PLAYLIST_LOADED" | "SEARCH_RESULT" | "NO_MATCHES" | "LOAD_FAILED";

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
	filters: Array<string>;
	sourceManagers: Array<string>;
	plugins: Array<PluginMeta>;
}

export type LavalinkVersion = {
	semver: string;
	major: number;
	minor: number;
	patch: number;
	preRelease: string | null;
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

export type GetLavalinkStatsResult = NullChild<Stats, "frameStats">;

export type GetLavalinkVersionResult = string;
