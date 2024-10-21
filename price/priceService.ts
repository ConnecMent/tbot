import { baseUrl } from './url.js';
import { Candle, TimeFrame, Pair } from '../types/common.js';

export async function fetchCandles(
  pair: Pair,
  timeFrame: TimeFrame,
): Promise<Candle[]> {
  const response = await fetch(
    `${baseUrl}/candles/perpetualMarkets/${pair}?resolution=${timeFrame}`,
  );

  if (!response.ok) {
    throw new Error(
      'Network response was not ok or maybe input not valid pair and timeFrame',
    );
  }

  const data = await response.json();

  return data.candles;
}
