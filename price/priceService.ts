import { CompositeClient } from '@dydxprotocol/v4-client-js';

import { Candle, TimeFrame, Pair } from '../types/common.js';

const createPriceService = async (compositeClient: CompositeClient) => {
  return {
    async fetchCandles(pair: Pair, timeFrame: TimeFrame): Promise<Candle[]> {
      const marketCandlesResult =
        await compositeClient.indexerClient.markets.getPerpetualMarketCandles(
          pair,
          timeFrame,
        );
      return marketCandlesResult.candles;
    },
  };
};

export default createPriceService;
