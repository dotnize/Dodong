# Noize ![node.js CI](https://github.com/nizeic/Noize/actions/workflows/node.js.yml/badge.svg)
A music bot written using [discord.js](https://github.com/discordjs/discord.js) and [discord-player](https://github.com/Androz2091/discord-player)

![Screenshot of the bot in action](https://i.imgur.com/egGecyj.png)

**NOTE: This project is still under development and could contain bugs & unfinished features. Please use at your own risk.**

## Contribute
View the list of bug reports and feature requests [here](https://github.com/nizeic/Noize/issues).

## Deploy automatically
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)<br><br>
[![Run on Repl.it](https://repl.it/badge/github/nizeic/Noize)](https://repl.it/github/nizeic/Noize)<br>
**NOTE:** repl.it uses Node.js v12 by default which is unsupported by the bot.<br>
To install Node.js v16, execute this script from the **Shell**:
```sh
npm init -y && npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
```

## Manual installation
1. Install [Node.js v16](https://nodejs.org/en/download/current)
2. Clone this repository
    ```sh
    git clone https://github.com/nizeic/Noize.git
    ```
3. Install dependencies
    ```sh
    npm install
    ```
4. Enter your [bot token](https://discord.com/developers/applications) and [Genius API Token](https://genius.com/api-clients) in `config.js`
    ```js
    bottoken: "BOT TOKEN HERE",
    geniusAPItoken: "GENIUS.COM CLIENT ACCESS TOKEN HERE"
    ```
5. Run the bot
    ```sh
    node index.js
    ```