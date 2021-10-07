const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
const { prefix } = require("../config.js");


module.exports = new Command({
  name: "filter",
  description: "View and set audio filters",
  permission: "SEND_MESSAGES",
  aliases: ["f"],
  async run (message, args, client) {

    if(!message.member.voice.channelId)
        return message.reply({ content: "You are not in a voice channel!" });
    if(message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
        return message.reply({ content: "You are not in my voice channel!" });
    const queue = client.player.getQueue(message.guild);
    const embed = new MessageEmbed();
    if(!queue || !queue.playing) return;
    if(!args[1]) {
        if(queue && queue.playing)
          display_status(queue, embed, message);
        return;
    }

    let filterType = [args[1]];

    if(args.length > 2){
      filterType = [];
      for(let i in args){
        if(i == 0) continue;
        filterType.push(args[i]);
      }
    }

    // filter is the container for valid filters
    let enabledFilters, disabledFilters, filter = {};

    switch(filterType[0]){
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
    for(let i of filterType){
      // If typo or filter is not found or filter is already enabled
      if(!disabledFilters.includes(i)){
        isTypo = true;
        filterType[count] = "";
        count++;
        typofilters = typofilters.concat(i+", ");
        continue;
      }
      filter[`${i}`] = true;
      count++;
    }
    if(isTypo){
      typofilters = typofilters.substring(0, typofilters.length-2); // to remove the commas
      await message.reply("The filter(s) `"+typofilters+"` is/are unavailable or already enabled.");
    }
    // If no valid filter 
    if(Object.keys(filter).length == 0){
      return;
    }
    // if there are already enabled/active filters
    if(enabledFilters.length > 0){
      embed.setDescription(`Removing Filters: **${enabledFilters.join(", ")}**`);
      await message.channel.send({ embeds: [embed] });
    }
    filterType = filterType.filter(s => s !== "");
    embed.setDescription(`Adding Filters: **${filterType.join(", ")}**`);
    message.channel.send({ embeds: [embed] });
    queue.setFilters(filter);
    return;
  }
});

const display_help = (queue, embed, message) => {
  embed.setDescription(`**Available Parameters:** off, status, help`);
  embed.addField('Filters:', 'bassboost_low\nvibrato\nbassboost\nreverse\nbassboost_high\ntreble\n8D\nnormalizer\nvaporwave\nnormalizer2\nnightcore\nsurrounding\nphaser\npulsator\ntremolo\nsubboost', true);
  embed.addField('\u200B', 'kakaoke\nexpander\nflanger\nsoftlimiter\nhaas\nchorus\nmcompand\nchorus2d\nmono\nchorus3d\nmstlr\nfadein\nmstrr\ndim\ncompressor\nearrape', true);
  message.channel.send({ embeds: [embed] });
  return;
}

const display_status = async (queue, embed, message) => {
  let enabledFilters = await queue.getFiltersEnabled();

  if(enabledFilters.length == 0){
    embed.setDescription(`There are currently no active filters. Use **${prefix}f help** to view all available filters.`);
  }else{
    embed.setDescription(`**Active Filters:**\n
    ${enabledFilters.join("\n")}`);
  }

  return message.channel.send({ embeds: [embed] });
}

const filters_off = async (queue, embed, message) => {
  let filter = {};
  let enabledFilters = await queue.getFiltersEnabled();

  if(enabledFilters.length == 0){
    embed.setDescription(`There are no filters enabled.`);
    message.channel.send({ embeds: [embed] });
    return;
  }
  for(let i of enabledFilters){
    filter[`${i}`] = false;
  }
  queue.setFilters(filter);
  return;
}