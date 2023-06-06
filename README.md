> Note: This project is no longer actively maintained.

<div align="center">
  <p>
    <img src="https://i.imgur.com/un792U4.png" width="500" alt="Dodong" /></a>
  </p>
  <br>
  <p>
    <a href="https://github.com/nizewn/Dodong/commits/main"><img src="https://img.shields.io/github/last-commit/nizewn/Dodong?color=44b868&logo=GitHub&logoColor=white&style=flat-square" alt="last commit"></a> 
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/github/package-json/dependency-version/nizewn/Dodong/discord.js?color=44b868&logo=npm&style=flat-square"></a>
    <a href="https://www.npmjs.com/package/discord-player"><img src="https://img.shields.io/github/package-json/dependency-version/nizewn/Dodong/discord-player?color=44b868&logo=npm&style=flat-square"></a>
  </p>
</div>
<br>

A music bot written using [discord.js](https://github.com/discordjs/discord.js) and [discord-player](https://github.com/Androz2091/discord-player)

- YouTube, Spotify, and SoundCloud
- support for both slash & legacy commands
- audio filters
- lyrics search
- ... and more! ([see all commands](https://github.com/nizewn/Dodong/tree/main/commands))

![Screenshot of the bot in action](https://i.imgur.com/SfDflUk.png)

## Contribute

View the list of bug reports and feature requests [here](https://github.com/nizewn/Dodong/issues).

## Deploy automatically

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nizewn/Dodong)<br><br>
[![Run on Repl.it](https://repl.it/badge/github/nizewn/Dodong)](https://repl.it/github/nizewn/Dodong)

## Manual installation

1. Install [Node.js](https://nodejs.org/en/download) (v16.9 or newer)
2. Clone this repository
   ```sh
   git clone https://github.com/nizewn/Dodong.git
   ```
3. Install dependencies
   ```sh
   npm install
   ```
4. Enter your [bot token](https://discord.com/developers/applications) in `config.js`
   ```js
   botToken: "BOT TOKEN HERE",
   ```
5. Run the bot
   ```sh
   npm start
   ```

## Run with Docker

1. Enter your [bot token](https://discord.com/developers/applications) in `config.js`

   ```js
   botToken: "BOT TOKEN HERE",
   ```

2. Build the Docker image

   ```sh
   docker build -t dodong .
   ```

3. Run the Docker image
   ```sh
   docker run -d -it --name dodong --restart unless-stopped dodong
   ```
