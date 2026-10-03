export type UnknownRecord = Record<string, unknown>;

export const asRecord = (v: unknown): UnknownRecord =>
  typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as UnknownRecord) : {};

export const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

export const asString = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

export const asNumber = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

export const asBoolean = (v: unknown): boolean | undefined => (typeof v === 'boolean' ? v : undefined);
