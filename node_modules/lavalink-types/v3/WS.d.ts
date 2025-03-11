import { PlayerUpdate, PlayerEvent } from "./Player";
import { Stats } from "./Shared";

export type OutboundHandshakeHeaders = {
	Authorization: string;
	"User-Id": string;
	"Client-Name": string;
	"Resume-Key"?: string;
}

export type InboundHandshakeHeaders = {
	"Session-Resumed"?: boolean;
	"Lavalink-Major-Version": string;
}

export type OPType = "ready" | "playerUpdate" | "stats" | "event";

type OPPayload<Event extends OPType, D = object> = { op: Event } & { [K in keyof D]: D[K] };

export type ReadyData = {
	resumed: boolean;
	sessionId: string;
}

export type ReadyOP = OPPayload<"ready", ReadyData>;

export type PlayerUpdateOP = OPPayload<"playerUpdate", PlayerUpdate>;

export type StatsOP = OPPayload<"stats", Stats>;

export type EventOP = OPPayload<"event", PlayerEvent>;

export type WebsocketMessage = ReadyOP | PlayerUpdateOP | StatsOP | EventOP;
