const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "filter",
  description: "Enables bass boosting audio effect",
  usage: "<none|low|medium|high>",
  permissions: "SEND_MESSAGES",
  aliases: ["f"],
  async run (message, args, client) {

    if(!message.member.voice.channelId)
        return message.reply({ content: "You are not in a voice channel!" });
    if(message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
        return message.reply({ content: "You are not in my voice channel!" });
    if(!args[1]) {
        const queue = client.player.getQueue(message.guild);
        if(queue && queue.playing) { // resume
            const paused = queue.setPaused(false);
            if(paused) message.react('▶️');
        }
        return;
    }

    /* 
      Things I did not do (for error handling)

      - Returns if there is no music playing
    */

    const queue = client.player.getQueue(message.guild);

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
    const embed = new MessageEmbed();

    switch(filterType[0]){
      case "help":
        return display_help(queue, embed, message);
        break;
      case "off":
        return filters_off(queue, embed, message);
        break;
      case "status":
        return display_status(queue, embed, message);
        break;
    }

    enabledFilters = await queue.getFiltersEnabled();
    disabledFilters = await queue.getFiltersDisabled();

    let count = 0, isTypo = false;

    for(let i of filterType){
      // If typo or filter is not found or filter is already enabled
      if(!disabledFilters.includes(i)){
        isTypo = true;
        await message.reply(`There are no ${i} type of filter or filter is already enabled.`);
        filterType[count] = "";
        continue;
      }
      filter[`${i}`] = true;
      count++;
    }
    if(isTypo){
      await message.reply(` Use **help** to display a list of available filters and use **status** to display enabled filters`);
    }
    // If no valid filter 
    if(Object.keys(filter).length == 0){
      return;
    }
    // if there are already enabled/active filters
    if(enabledFilters.length > 0){
      message.channel.send(`Removing Filters: **${enabledFilters.join(", ")}**`);
    }
    message.channel.send(`Adding Filters: **${filterType.join(", ")}**`);
    queue.setFilters(filter);
    return;
  }
}

const display_help = (queue, embed, message) => {
embed.setDescription(`**Available Parameters:**\n
- off
- status
- help

**Filters:**

- bassboost_low     
- vibrato
- bassboost	        
- reverse
- bassboost_high	  
- treble
- 8D                
- normalizer
- vaporwave         
- normalizer2
- nightcore         
- surrounding
- phaser            
- pulsator
- tremolo           
- subboost
- kakaoke           
- expander
- flanger           
- softlimiter
- haas              
- chorus
- mcompand          
- chorus2d
- mono              
- chorus3d
- mstlr             
- fadein
- mstrr             
- dim
- compressor        
- earrape`);

message.channel.send({ embeds: [embed] });
return;
}

const display_status = (queue, embed, message) => {
  let enabledFilters = queue.getFiltersEnabled();

  if(enabledFilters.length == 0){
    embed.setDescription(`There are currently no active filters`);
  }else{
    embed.setDescription(`**Active Filters:**\n
    ${enabledFilters.join("\n")}`);
  }

  return message.channel.send({ embeds: [embed] });
}

const filters_off = (queue, embed, message) => {
  let filter = {};
  let enabledFilters = queue.getFiltersEnabled();

  if(enabledFilters.length == 0){
    message.channel.send(`There are no filters enabled! Hmmph :triumph: `);
    return;
  }
  for(let i of enabledFilters){
    filter[`${i}`] = false;
  }
  queue.setFilters(filter);
  return;
}