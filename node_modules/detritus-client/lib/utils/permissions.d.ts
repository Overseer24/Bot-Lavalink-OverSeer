export declare type PermissionChecks = Array<bigint | number | string> | bigint | number | string;
export declare function checkPermissions(permissions: bigint | number, check: PermissionChecks): boolean;
