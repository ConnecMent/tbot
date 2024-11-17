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
  Network,
  CompositeClient,
  IndexerClient,
  BECH32_PREFIX,
  OrderTimeInForce,
  Order_TimeInForce,
  OrderExecution,
  TickerType,
  OrderStatus,
} from '@dydxprotocol/v4-client-js';

const conditionalGoodTilTimeInSeconds = 2592000; // ~ 1 month
const limitGoodTilTimeInSeconds = 900; // ~ 15 minutes

const createOrderService = async (mnemonic: string, network: Network) => {
  const wallet = await DefV4ClientJs.LocalWallet.fromMnemonic(
    mnemonic,
    BECH32_PREFIX,
  );
  const subAccount = new SubaccountClient(wallet, 0);
  const client = await CompositeClient.connect(network);
  const indexerClient = new IndexerClient(network.indexerConfig);
  const clientIdGen = (): number => {
    return Date.now() * 1000 + Math.floor(Math.random() * 1000);
  };

  return {
    placeLimitOrder: async (
      pair: Pair,
      side: PositionType,
      price: number,
      size: number,
      config?: OrderConfig,
    ): Promise<Tx> => {
      return client.placeOrder(
        subAccount,
        pair,
        OrderType.LIMIT,
        side === 'long' ? OrderSide.BUY : OrderSide.SELL,
        price,
        size,
        clientIdGen(),
        config?.timeInForce,
        limitGoodTilTimeInSeconds,
        config?.execution,
        config?.postOnly,
        false,
      );
    },

    placeMarketOrder: async (
      pair: Pair,
      side: PositionType,
      size: number,
    ): Promise<Tx> => {
      return client.placeShortTermOrder(
        subAccount,
        pair,
        side === 'long' ? OrderSide.BUY : OrderSide.SELL,
        side === 'long' ? 10_000_000 : Number.EPSILON,
        size,
        clientIdGen(),
        +(await indexerClient.utility.getHeight()).height + 20,
        Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        false,
      );
    },

    placeMarketTakeProfitOrder: async (
      pair: Pair,
      side: PositionType,
      size: number,
      triggerPrice: number,
    ): Promise<Tx> => {
      return client.placeOrder(
        subAccount,
        pair,
        OrderType.TAKE_PROFIT_MARKET,
        side === 'long' ? OrderSide.BUY : OrderSide.SELL,
        side === 'long' ? 10_000_000 : Number.EPSILON,
        size,
        clientIdGen(),
        OrderTimeInForce.GTT,
        conditionalGoodTilTimeInSeconds,
        OrderExecution.IOC,
        false,
        true,
        triggerPrice,
      );
    },

    placeMarketStopLossOrder: async (
      pair: Pair,
      side: PositionType,
      size: number,
      triggerPrice: number,
    ): Promise<Tx> => {
      return client.placeOrder(
        subAccount,
        pair,
        OrderType.STOP_MARKET,
        side === 'long' ? OrderSide.BUY : OrderSide.SELL,
        side === 'long' ? 10_000_000 : Number.EPSILON,
        size,
        clientIdGen(),
        OrderTimeInForce.GTT,
        conditionalGoodTilTimeInSeconds,
        OrderExecution.IOC,
        false,
        true,
        triggerPrice,
      );
    },

    listPositions: async (): Promise<Position[]> => {
      return indexerClient.account
        .getSubaccountPerpetualPositions(
          wallet.address || '',
          subAccount.subaccountNumber,
        )
        .then((res) => {
          return res.positions;
        });
    },

    listAssetPositions: async (): Promise<Position[]> => {
      return indexerClient.account
        .getSubaccountAssetPositions(
          wallet.address || '',
          subAccount.subaccountNumber,
        )
        .then((res) => {
          return res.positions;
        });
    },

    listOpenOrders: async () => {
      return indexerClient.account.getSubaccountOrders(
        wallet.address || '',
        subAccount.subaccountNumber,
        undefined,
        TickerType.PERPETUAL,
        undefined,
        OrderStatus.OPEN,
      );
    },
  };
};

export default createOrderService;
