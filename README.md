# Noize [![made with love](https://img.shields.io/badge/made_with-love-red.svg)](https://shields.io/)
A music bot written using [discord.js](https://github.com/discordjs/discord.js) and [discord-player](https://github.com/Androz2091/discord-player)

## Bug reports and feature requests
View the list of issues [here](https://github.com/nizeic/Noize/issues)

## Commands
* clear
* disconnect
* loop
* lyrics
* move
* nowplaying
* pause
* play
* previous
* queue
* remove
* resume
* seek
* shuffle
* skip

## Installation
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) or manually install:
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