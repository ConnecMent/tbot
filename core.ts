import { Network } from '@dydxprotocol/v4-client-js';
import config from './config.js';

import { installPlugins } from './install-plugins.js';
import { loadStrategies } from './load-strategies.js';
import logger from './log-service.js';
import createOrderService from './order-service/order-service.js';
import { fetchCandles } from './price/priceService.js';

import { timeframeInMs } from './constants.js';

logger.info('Starting bot');

const strategies = await loadStrategies();
logger.info('Strategies loaded');
const requiredPluginNames = [
  ...new Set(
    strategies.flatMap((strategy) => [
      strategy.planPlugin,
      strategy.executePlugin,
      strategy.managePlugin,
    ]),
  ),
];

logger.debug('Installing or loading required plugins', requiredPluginNames);
const plugins = await installPlugins(requiredPluginNames);
logger.info('Plugins installed or loaded');

strategies.forEach(async (strategy) => {
  const orderService = await createOrderService(
    config.mnemonic,
    strategy.type === 'mainnet' ? Network.mainnet() : Network.testnet(),
  );

  logger.info(`Order service created for strategy ${strategy.id}`);

  const runStrategy = async () => {
    logger.info(`Running strategy ${strategy.id}`);
    const candles = await fetchCandles(strategy.pair, strategy.timeframe);
    logger.info(
      `Candles for ${strategy.pair} in timeframe ${strategy.timeframe} fetched`,
    );

    const planPlugin = plugins[strategy.planPlugin.name];
    const executePlugin = plugins[strategy.executePlugin.name];
    const managePlugin = plugins[strategy.managePlugin.name];

    const side = planPlugin.chooseSide?.(candles);
    logger.info(`Plan plugin ran over fetched candles`);
    logger.info(`Plan plugin result: ${side}`);

    if (side) {
      logger.debug(
        'Running execute plugin because plan plugin result was not null',
      );

      await executePlugin.execute?.(candles, side, strategy.pair, orderService);
      logger.info('Execute plugin ran based on plan');
    }

    await managePlugin.manage?.(orderService);
    logger.info('Manage plugin run');

    logger.info(`Strategy with id ${strategy.id} completed running`);
  };

  runStrategy();
  setInterval(runStrategy, timeframeInMs[strategy.timeframe]);
});
