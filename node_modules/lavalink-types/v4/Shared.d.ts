export type Exception = {
	message: string | null;
	severity: Severity;
	cause: string;
}

export type Severity = "common" | "suspicious" | "fault";

export type Track = {
	encoded: string;
	info: TrackInfo;
	pluginInfo: Record<any, any>;
	userData: Record<any, any>
}

export type TrackInfo = {
	identifier: string;
	isSeekable: boolean;
	author: string;
	length: number;
	isStream: boolean;
	position: number;
	title: string;
	uri: string | null;
	artworkUrl: string | null;
	isrc: string | null;
	sourceName: string;
}

export type Stats = {
	players: number;
	playingPlayers: number;
	uptime: number;
	memory: MemoryStats;
	cpu: CPUStats;
	frameStats: FrameStats;
}

export type MemoryStats = {
	free: number;
	used: number;
	allocated: number;
	reservable: number;
}

export type CPUStats = {
	cores: number;
	systemLoad: number;
	lavalinkLoad: number;
}

export type FrameStats = {
	sent: number;
	nulled: number;
	deficit: number;
}
