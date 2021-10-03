# Noize [![made with love](https://img.shields.io/badge/made_with-love-red.svg)](https://shields.io/)
A music bot written using [discord.js](https://github.com/discordjs/discord.js) and [discord-player](https://github.com/Androz2091/discord-player)

## To-do list
- [ ] fastforward command
- [ ] lyrics
- [ ] audio filters/effects
- [ ] command folders/categories
- [ ] slash commands

## Commands
* clear
* disconnect
* loop
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
1. Install [Node.js v16](https://nodejs.org/en/download/current)
2. Clone this repository
    ```sh
    git clone https://github.com/nizeic/Noize.git
    ```
3. Install dependencies
    ```sh
    npm install
    ```
4. Enter your bot token in `config.json`
    ```json
    "token": "YOUR TOKEN HERE"
    ```
5. Uncomment line 5 and comment out line 6 in index.js
    ```js
    client.init(config.token);
    //client.init(process.env.BOT_TOKEN) // for heroku
    ```
6. Run the bot
    ```sh
    node .
    ```
