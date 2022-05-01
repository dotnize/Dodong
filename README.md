<div align="center">
  <p>
    <img src="https://nize.ph/gallery/dodongmedium.png" width="500" alt="Dodong" /></a>
  </p>
  <br>
  <p>
    <a href="https://github.com/nizeic/Dodong/commits/main"><img src="https://img.shields.io/github/last-commit/nizeic/Dodong?color=44b868&logo=GitHub&logoColor=white&style=flat-square" alt="last commit"></a> 
    <a href="https://puersa.com/discord"><img src="https://img.shields.io/discord/706460727573217381?color=44b868&logo=discord&logoColor=white&style=flat-square" alt="discord server"></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/github/package-json/dependency-version/nizeic/Dodong/discord.js?color=44b868&logo=npm&style=flat-square"></a>
    <a href="https://www.npmjs.com/package/discord-player"><img src="https://img.shields.io/github/package-json/dependency-version/nizeic/Dodong/discord-player?color=44b868&logo=npm&style=flat-square"></a>
  </p>
</div>
<br>

A music bot written using [discord.js](https://github.com/discordjs/discord.js) and [discord-player](https://github.com/Androz2091/discord-player)
- YouTube, Spotify, and SoundCloud
- support for both slash & legacy commands
- audio filters
- lyrics search
- web-based player controls (optional, [coming soon](https://github.com/JoshCunningHum/Dodong-webplayer))
- ... and more! ([see all commands](https://github.com/nizeic/Dodong/tree/main/commands))

![Screenshot of the bot in action](https://puersa.com/gallery/dodongexample.png)

## Contribute

View the list of bug reports and feature requests [here](https://github.com/nizeic/Dodong/issues).

## Deploy automatically

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)<br><br>
[![Run on Repl.it](https://repl.it/badge/github/nizeic/Dodong)](https://repl.it/github/nizeic/Dodong)<br>
**NOTE:** repl.it uses Node.js v12 by default which is unsupported by the bot.<br>
To install Node.js v16, execute this script from the **Shell**:

```sh
npm init -y && npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
```

## Manual installation

1. Install [Node.js v16](https://nodejs.org/en/download)
2. Clone this repository
   ```sh
   git clone https://github.com/nizeic/Dodong.git
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
