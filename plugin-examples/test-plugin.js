export default {
  name: 'bot-plugin-test',
  chooseSide: (candles) => {
    const allGreen = candles
      .slice(0, 3)
      .every((candle) => +candle.close > +candle.open);
    if (allGreen) return 'long';

    const allRed = candles
      .slice(0, 3)
      .every((candle) => +candle.close < +candle.open);
    if (allRed) return 'short';

    return null;
  },
  execute: async (candles, side, pair, orderService) => {
    const balance = (await orderService.listAssetPositions())[0].size;
    const lastClose = +candles[0].close;
    const size = +balance / 10 / lastClose;

    await orderService.placeMarketOrder(pair, side, size);

    const tp = lastClose * 1.02;
    const sl = lastClose * 0.99;

    await orderService.placeMarketTakeProfitOrder(pair, side, size, tp);
    await orderService.placeMarketStopLossOrder(pair, side, size, sl);

    return '';
  },
  manage: async (_, config) => {
    console.log(config.foo, config.bar);
  },
};
