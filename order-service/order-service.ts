import {
  Tx,
  Pair,
  Position,
  OrderConfig,
  PositionType,
} from '../types/common.js';
import DefV4ClientJs, {
  OrderSide,
  OrderType,
  SubaccountClient,
  CompositeClient,
  BECH32_PREFIX,
  OrderTimeInForce,
  Order_TimeInForce,
  OrderExecution,
  TickerType,
  OrderStatus,
  SHORT_BLOCK_WINDOW,
} from '@dydxprotocol/v4-client-js';

const conditionalGoodTilTimeInSeconds = 2592000; // ~ 1 month

const createOrderService = async (
  mnemonic: string,
  compositeClient: CompositeClient,
) => {
  const wallet = await DefV4ClientJs.LocalWallet.fromMnemonic(
    mnemonic,
    BECH32_PREFIX,
  );
  const subAccount = new SubaccountClient(wallet, 0);
  const clientIdGen = (): number => {
    return Date.now() * 1000 + Math.floor(Math.random() * 1000);
  };

  return {
    placeLimitOrder: async (
      pair: Pair,
      side: PositionType,
      price: number,
      size: number,
      config?: Pick<OrderConfig<Order_TimeInForce>, 'timeInForce' | 'id'>,
    ): Promise<Tx> => {
      return compositeClient.placeShortTermOrder(
        subAccount,
        pair,
        side === 'long' ? OrderSide.BUY : OrderSide.SELL,
        price,
        size,
        config?.id ?? clientIdGen(),
        +(await compositeClient.indexerClient.utility.getHeight()).height +
          SHORT_BLOCK_WINDOW,
        config?.timeInForce ?? Order_TimeInForce.TIME_IN_FORCE_IOC,
        false,
      );
    },

    placeMarketOrder: async (
      pair: Pair,
      side: PositionType,
      size: number,
      config?: Pick<OrderConfig<Order_TimeInForce>, 'timeInForce' | 'id'>,
    ): Promise<Tx> => {
      return compositeClient.placeShortTermOrder(
        subAccount,
        pair,
        side === 'long' ? OrderSide.BUY : OrderSide.SELL,
        side === 'long' ? 10_000_000 : Number.EPSILON,
        size,
        config?.id ?? clientIdGen(),
        +(await compositeClient.indexerClient.utility.getHeight()).height + 20,
        config?.timeInForce ?? Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        false,
      );
    },

    placeMarketTakeProfitOrder: async (
      pair: Pair,
      side: PositionType,
      size: number,
      triggerPrice: number,
      config?: Omit<OrderConfig<OrderTimeInForce>, 'timeInForce'>,
    ): Promise<Tx> => {
      return compositeClient.placeOrder(
        subAccount,
        pair,
        OrderType.TAKE_PROFIT_MARKET,
        side === 'long' ? OrderSide.BUY : OrderSide.SELL,
        side === 'long' ? 10_000_000 : Number.EPSILON,
        size,
        config?.id ?? clientIdGen(),
        OrderTimeInForce.GTT,
        conditionalGoodTilTimeInSeconds,
        config?.execution ?? OrderExecution.IOC,
        config?.postOnly ?? false,
        true,
        triggerPrice,
      );
    },

    placeMarketStopLossOrder: async (
      pair: Pair,
      side: PositionType,
      size: number,
      triggerPrice: number,
      config?: Omit<OrderConfig<OrderTimeInForce>, 'timeInForce'>,
    ): Promise<Tx> => {
      return compositeClient.placeOrder(
        subAccount,
        pair,
        OrderType.STOP_MARKET,
        side === 'long' ? OrderSide.BUY : OrderSide.SELL,
        side === 'long' ? 10_000_000 : Number.EPSILON,
        size,
        config?.id ?? clientIdGen(),
        OrderTimeInForce.GTT,
        conditionalGoodTilTimeInSeconds,
        config?.execution ?? OrderExecution.IOC,
        config?.postOnly ?? false,
        true,
        triggerPrice,
      );
    },

    listPositions: async (): Promise<Position[]> => {
      return compositeClient.indexerClient.account
        .getSubaccountPerpetualPositions(
          wallet.address || '',
          subAccount.subaccountNumber,
        )
        .then((res) => {
          return res.positions;
        });
    },

    listAssetPositions: async (): Promise<Position[]> => {
      return compositeClient.indexerClient.account
        .getSubaccountAssetPositions(
          wallet.address || '',
          subAccount.subaccountNumber,
        )
        .then((res) => {
          return res.positions;
        });
    },

    listOpenOrders: async () => {
      return compositeClient.indexerClient.account.getSubaccountOrders(
        wallet.address || '',
        subAccount.subaccountNumber,
        undefined,
        TickerType.PERPETUAL,
        undefined,
        OrderStatus.OPEN,
      );
    },

    listFills: async (pair?: string) => {
      return compositeClient.indexerClient.account
        .getSubaccountFills(
          wallet.address || '',
          subAccount.subaccountNumber,
          pair,
          TickerType.PERPETUAL,
        )
        .then((res) => {
          return res.fills;
        });
    },
  };
};

export default createOrderService;
