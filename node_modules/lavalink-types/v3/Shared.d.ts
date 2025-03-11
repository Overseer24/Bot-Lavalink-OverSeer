export type Exception = {
	message: string | null;
	severity: Severity;
	cause: string;
}

export type Severity = "COMMON" | "SUSPICIOUS" | "FAULT";

export type Track = {
	encoded: string;
	info: TrackInfo;
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
	sourceName: string;
}

export type Stats = {
	players: number;
	playingPlayers: number;
	uptime: number;
	memory: MemoryStats;
	cpu: CPUStats;
	frameStats: FrameStats | null;
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
