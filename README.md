# tbot

An extensible trading bot - write your own plugins for planning trades, execute and manage them.

## Description

tbot is a flexible trading bot framework that allows users to create and implement their own trading strategies through a rich plugin system. The repository contains the core that runs the strategies provided by the user.

## Main Features

- Extensible architecture through a comprehensive plugin system
- Support for multiple trading strategies
- Docker-based deployment for easy setup and management

## Prerequisites

- Docker

## Usage

1. Create a `.env` file in the root of the repository, containing:

   - Required strategies file path
   - Required mnemonic of the wallet used for trading configs
   - Optional logs path and frequency

2. Run the bot using Docker Compose:
   ```
   docker compose up -d
   ```

## Plugin System

tbot supports three types of plugins:

1. **Plan**: Used to plan for a trade based on candles. Can return long, short, or nothing.
2. **Execute**: Used to execute when a plan plugin returns long or short. Determines how/when to open an order (e.g., triggers, etc.).
3. **Manage**: A general-purpose plugin, mostly used for managing open positions (e.g., increasing/decreasing size, closing old non-filled orders, etc.).

## Strategies

A strategy in tbot consists of:

- ID
- Platform (the exchange used for trading - currently only dYdX is supported)
- Type (testnet/mainnet)
- Trading pair
- Timeframe
- Plugins information (name and URL for plan, execute, and manage plugins)

These components together create a unique strategy. Multiple strategies with different pairs, timeframes, and plugins can be implemented.

## Examples

- Plugin examples can be found in the `plugin-examples` directory.
- Strategy examples are available in the `strategies` directory.

## Supported Platforms

Currently, only dYdX is supported as a trading platform.

## Team

The MVP of this project was developed as part of [ConnecMent](https://github.com/ConnecMent).  
Mentor: [@mkermani144](https://github.com/mkermani144)  
Mentees: [@Mr-MRF-Dev](https://github.com/Mr-MRF-Dev), [@raminLgh](https://github.com/raminLgh)
