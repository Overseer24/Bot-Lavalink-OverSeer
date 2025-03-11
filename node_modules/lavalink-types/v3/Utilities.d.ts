export type RequiredInChild<T, K extends keyof T> = T & { [key in K]: Required<T[K]> };
export type NullChild<T, K extends keyof T> = T & { [key in K]: null };
