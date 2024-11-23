import { TimeFrame, PluginConfig, Milliseconds } from './common.js';

export interface PluginInfo {
  name: string;
  url: string;
  config: PluginConfig;
}

export interface Strategy {
  /**
   * FIXME: Change to string when support for other platforms is planned
   * https://github.com/ConnecMent/dydx-bot/issues/20
   */
  id: string;
  platform: 'dydx';
  type: 'testnet' | 'mainnet';
  pair: string;
  timeframe: TimeFrame;
  tickInterval: Milliseconds;
  planPlugin: PluginInfo;
  executePlugin: PluginInfo;
  managePlugin: PluginInfo;
}
