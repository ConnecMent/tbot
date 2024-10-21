export const strategySchema: Readonly<{
  id: (value: unknown) => boolean;
  platform: (value: unknown) => boolean;
  pair: (value: unknown) => boolean;
  timeframe: (value: unknown) => boolean;
  planPlugin: (value: unknown) => boolean;
  executePlugin: (value: unknown) => boolean;
  managePlugin: (value: unknown) => boolean;
}> = {
  id: (value: unknown): boolean => typeof value === 'string',
  platform: (value: unknown): boolean => value === 'dydx',
  pair: (value: unknown): boolean => typeof value === 'string',
  timeframe: (value: unknown): boolean =>
    typeof value === 'string' &&
    ['1MIN', '5MINS', '15MINS', '30MINS', '1HOUR', '4HOURS', '1DAY'].includes(
      value,
    ),
  planPlugin: (value: unknown): boolean => typeof value === 'object',
  executePlugin: (value: unknown): boolean => typeof value === 'object',
  managePlugin: (value: unknown): boolean => typeof value === 'object',
};
