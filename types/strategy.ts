import { TimeFrame } from './common.js';

export interface PluginInfo {
  name: string;
  url: string;
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
  planPlugin: PluginInfo;
  executePlugin: PluginInfo;
  managePlugin: PluginInfo;
}
