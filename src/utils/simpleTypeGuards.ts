export const isString = (value: unknown): value is string => typeof value === "string";

export const isNumber = (value: unknown): value is number => typeof value === "number";

export const isBigInt = (value: unknown): value is bigint => typeof value === "bigint";

export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
