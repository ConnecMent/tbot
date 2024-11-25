import { Network, CompositeClient } from '@dydxprotocol/v4-client-js';
import config from './config.js';

import { installPlugins } from './install-plugins.js';
import { loadStrategies } from './load-strategies.js';
import logger from './log-service.js';
import createOrderService from './order-service/order-service.js';
import createPriceService from './price/priceService.js';

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
  const compositeClient = await CompositeClient.connect(
    strategy.type === 'mainnet' ? Network.mainnet() : Network.testnet(),
  );
  const priceService = await createPriceService(compositeClient);
  const orderService = await createOrderService(
    config.mnemonic,
    compositeClient,
  );

  logger.info(`Order service created for strategy ${strategy.id}`);

  const runStrategy = async () => {
    logger.info(`Running strategy ${strategy.id}`);
    const candles = await priceService.fetchCandles(
      strategy.pair,
      strategy.timeframe,
    );
    logger.info(
      `Candles for ${strategy.pair} in timeframe ${strategy.timeframe} fetched`,
    );

    const planPlugin = plugins[strategy.planPlugin.name];
    const executePlugin = plugins[strategy.executePlugin.name];
    const managePlugin = plugins[strategy.managePlugin.name];

    const side = planPlugin.plugin.chooseSide?.(candles, planPlugin.config);
    logger.info(`Plan plugin ran over fetched candles`);
    logger.info(`Plan plugin result: ${side}`);

    if (side) {
      logger.debug(
        'Running execute plugin because plan plugin result was not null',
      );

      await executePlugin.plugin.execute?.(
        candles,
        side,
        strategy.pair,
        orderService,
        executePlugin.config,
      );
      logger.info('Execute plugin ran based on plan');
    }

    await managePlugin.plugin.manage?.(orderService, managePlugin.config);
    logger.info('Manage plugin run');

    logger.info(`Strategy with id ${strategy.id} completed running`);
  };

  runStrategy();
  setInterval(runStrategy, strategy.tickInterval);
});
