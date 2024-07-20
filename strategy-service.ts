import { type PositionType, type Pair, type Candle } from "./types/common";

function strategyService(record: { [key: Pair]: Array<Candle> }): {
  [key: Pair]: PositionType;
} {
  return { pair1: "long" };
}
