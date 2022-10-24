const Command = require("../structures/command.js");
const { EmbedBuilder } = require('discord.js');
const { prefix } = require("../config.js");


module.exports = new Command({
  name: "filter",
  description: "View and set audio filters",
  permission: "SendMessages",
  options: [
    { description: 'Name of the audio filter', name: 'name', type: 3 }
  ],
  aliases: ["f"],
  async run (message, args, client, slash) {

    if(!message.member.voice.channelId)
        return message.reply({ embeds: [{ description: `You are not in a voice channel!`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false });
    if(message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId)
        return message.reply({ embeds: [{ description: `You are not in my voice channel!`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false });
    const queue = client.player.getQueue(message.guild);
    const embed = new EmbedBuilder();
    if(!queue || !queue.playing)
        return message.reply({embeds: [{ description: `Nothing is currently playing in this server.`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false });
    if(!args || !args.length) {
        return display_status(queue, embed, message);
    }
    args = slash ? args[0].split(" ") : args;
    embed.setColor('#44b868');

    // filter is the container for valid filters
    let enabledFilters, disabledFilters, filter = {};

    switch(args[0]){
      case "list":
      case "help":
        return display_help(queue, embed, message);
      case "off":
        return filters_off(queue, embed, message);
      case "status":
        return display_status(queue, embed, message);
    }

    enabledFilters = await queue.getFiltersEnabled();
    disabledFilters = await queue.getFiltersDisabled();

    let count = 0, isTypo = false;
    let typofilters = "";
    for(let i of args){
      // If typo or filter is not found or filter is already enabled
      if(!disabledFilters.includes(i)){
        isTypo = true;
        args[count] = "";
        count++;
        typofilters = typofilters.concat(i+", ");
        continue;
      }
      filter[`${i}`] = true;
      count++;
    }
    let reply = "";
    if(isTypo){
      typofilters = typofilters.substring(0, typofilters.length-2); // to remove the commas
      reply = reply.concat("The filter(s) `"+typofilters+"` is/are unavailable or already enabled.\n");
    }
    // If no valid filter 
    if(Object.keys(filter).length === 0){
      if(reply !== "") message.reply(reply);
      return;
    }
    // if there are already enabled/active filters
    if(enabledFilters.length > 0){
      reply = reply.concat(`Removing Filters: **${enabledFilters.join(", ")}**\n\n`);
    }
    args = args.filter(s => s !== "");
    embed.setDescription(`${reply}Adding Filters: **${args.join(", ")}**`);
    message.reply({ embeds: [embed], failIfNotExists: false });
    queue.setFilters(filter);
    return;
  }
});

const display_help = (queue, embed, message) => {
  embed.setDescription(`**Available Parameters:** off, status, help`);
  embed.addFields([
    { name: 'Filters:', value: 'bassboost_low\nvibrato\nbassboost\nreverse\nbassboost_high\ntreble\n8D\nnormalizer\nvaporwave\nnormalizer2\nnightcore\nsurrounding\nphaser\npulsator\ntremolo\nsubboost' },
    { name: '\u200B', value: 'karaoke\nexpander\nflanger\nsoftlimiter\nhaas\nchorus\nmcompand\nchorus2d\nmono\nchorus3d\nmstlr\nfadein\nmstrr\ndim\ncompressor\nearrape' }
  ]);
  message.reply({ embeds: [embed], failIfNotExists: false });
  return;
}

const display_status = async (queue, embed, message) => {
  let enabledFilters = await queue.getFiltersEnabled();

  embed.setColor('#b84e44');
  if(enabledFilters.length == 0){
    embed.setDescription(`There are currently no active filters. Use **${prefix}f help** to view all available filters.`);
  }else{
    embed.setDescription(`**Active Filters:**\n
    ${enabledFilters.join("\n")}`);
  }

  return message.reply({ embeds: [embed], failIfNotExists: false });
}

const filters_off = async (queue, embed, message) => {
  let filter = {};
  let enabledFilters = await queue.getFiltersEnabled();

  if(enabledFilters.length == 0){
    embed.setDescription(`There are no filters enabled.`);
    message.reply({ embeds: [embed], ephemeral: true, failIfNotExists: false });
    return;
  }
  for(let i of enabledFilters){
    filter[`${i}`] = false;
  }
  embed.setDescription(`Disabled all filters.`);
  message.reply({ embeds: [embed], failIfNotExists: false });
  queue.setFilters(filter);
  return;
}