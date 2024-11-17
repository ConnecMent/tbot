import { OrderExecution, OrderTimeInForce } from '@dydxprotocol/v4-client-js';
import {
  BroadcastTxAsyncResponse,
  BroadcastTxSyncResponse,
} from '@cosmjs/tendermint-rpc/build/tendermint37';
import { IndexedTx } from '@cosmjs/stargate';

export type Pair = string;
export type PositionType = 'long' | 'short' | null;
export type TimeFrame =
  | '1MIN'
  | '5MINS'
  | '15MINS'
  | '30MINS'
  | '1HOUR'
  | '4HOURS'
  | '1DAY';
export interface Candle {
  startedAt: string;
  ticker: string;
  resolution: TimeFrame;
  low: string;
  high: string;
  open: string;
  close: string;
  baseTokenVolume: string;
  usdVolume: string;
  trades: number;
  startingOpenInterest: string;
}

export type Tx = BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx;
export type Position = {
  symbol: string;
  side: string;
  size: string;
  assetId: string;
  subaccountNumber: number;
};

export interface OrderConfig {
  timeInForce?: OrderTimeInForce;
  execution?: OrderExecution;
  postOnly?: boolean;
}

/**
 * FIXME: Update when order service is implemented
 * https://github.com/ConnecMent/dydx-bot/issues/4
 */
export type Order = any;

export type PluginConfig = Record<string, unknown>;
