import createOrderService from '../order-service/order-service.js';
import { Candle, PositionType, PluginConfig } from './common.js';

export interface PlanPlugin {
  chooseSide(candles: Candle[], config?: PluginConfig): PositionType;
}

export interface ExecutePlugin {
  execute(
    candles: Candle[],
    side: PositionType,
    pair: string,
    orderService: Awaited<ReturnType<typeof createOrderService>>,
    config?: PluginConfig,
  ): Promise<void>;
}

export interface ManagePlugin {
  manage(
    orderService: Awaited<ReturnType<typeof createOrderService>>,
    config?: PluginConfig,
  ): Promise<void>;
}

export interface Plugin
  extends Partial<PlanPlugin>,
    Partial<ExecutePlugin>,
    Partial<ManagePlugin> {
  name: `bot-plugin-${string}`;
}
