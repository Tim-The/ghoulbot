"use strict";
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config');
const utils = require('./utils');
const fs = require("fs");
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find any commands.")
  }

jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} successfully loaded!`);
    client.commands.set(props.help.name, props);
  });

});

client.on("ready", () => {
  console.log(`GhoulBot is ready for action!`)
client.user.setActivity("your new ghoul-motes", { type: 'WATCHING' })
});

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on('raw', async event => {
	if (!events.hasOwnProperty(event.t)) return;

	const { d: data } = event;
	const user = client.users.get(data.user_id);
	const channel = client.channels.get(data.channel_id) || await user.createDM();
	if (channel.messages.has(data.message_id)) return;

	const message = await channel.fetchMessage(data.message_id);
	const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
	const reaction = message.reactions.get(emojiKey);

	client.emit(events[event.t], reaction, user);
});

client.on("messageReactionAdd", (messageReaction, user) => {
  if(messageReaction.message.content.match(/#\d+/g) === null){
    return
  }
  if(messageReaction.message.content.match(/http/) === null){
    return
  }
    let idd = messageReaction.message.content.match(/#\d+/g)
    let link = messageReaction.message.content.match(/http.*/)
    let loser = messageReaction.message.content.match(/@.*/)
    if(messageReaction.message.channel.id !== utils.queueChannel){
      return
    }
    let mentional = messageReaction.message.mentions.members.first();
    if(user.id === mentional.id){
      return
    }
    if(messageReaction.emoji.id === utils.denyEmote){
      if(user.id === mentional.id){
        return
      } else if(messageReaction.count >= config.denialCount){
        client.channels.get(utils.logChannel).send(`<:deny:${utils.denyEmote}> Submission \`${idd}\` has been denied.`)
        messageReaction.message.delete()
        messageReaction.message.channel.send(`<:deny:${utils.denyEmote}> Submission \`${idd}\` has been denied.`).then(m => m.delete(9000))
        client.channels.get(utils.deniedChannel).send(`-------------------------------\n**The following ghoul-mote has been denied:**\n**Link:** ${link}\n**Submitted by:** <${loser}\n**Submission ID:** ${idd}\n-------------------------------`)
      let denieduser = messageReaction.message.guild.members.get(mentional.id);
        denieduser.send(`<:GhoulWave:468250867825377290> Heya! Sadly, your submission \`${idd}\` has been denied. Thank you for your submission, we look forward to your next one!`)
      }
    } else if(messageReaction.emoji.id === utils.approveEmote){
      if(user.id === mentional.id){
        return
      } else if(messageReaction.count >= config.approvalCount){
        client.channels.get(utils.logChannel).send(`<:approve:${utils.approveEmote}> Submission \`${idd}\` has been approved.`)
        messageReaction.message.delete()
        messageReaction.message.channel.send(`<:approve:${utils.approveEmote}> Submission \`${idd}\` has been approved.`).then(m => m.delete(9000))
        client.channels.get(utils.approvedChannel).send(`-------------------------------\n**The following ghoul-mote has been approved:**\n**Link:** ${link}\n**Submitted by:** <${loser}\n**Submission ID:** ${idd}\n-------------------------------`)
        let emojimakerrole = messageReaction.message.guild.roles.find(`name`, `${utils.makerRoleName}`); 
        let approvedUser = messageReaction.message.guild.members.get(mentional.id);
        if(approvedUser.roles.has(emojimakerrole)){
          return
        } else {
          approvedUser.addRole(emojimakerrole)
        }
	 approvedUser.send(`<:GhoulWave:468250867825377290> Heya! Your submission \`${idd}\` has been approved and added to the server. Thanks for your submission!`)
      .catch(console.error)
      };
    }
});

client.on('error', console.error);

client.on("message", async message => {
  let modrole = message.guild.roles.find(`name`, utils.modRoleName)
  if(message.channel.id === utils.queueChannel){
    if(message.author.bot){
      return
    }
    if(message.member.roles.has(modrole.id)){
      return
    } else {
      message.delete()
      message.reply("Please do not send messages here.").then(m => m.delete(5000))
    }
  }
  if(message.channel.type === "dm"){
    return message.channel.send(`<:GhoulWave:468250867825377290> Heya! I don't accept commands from dms, use them in the Ghoul-Motes server!`)
  }
  let prefix = config.prefix
  if(message.content.indexOf(prefix) !== 0) return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(client, message, args)

  if(command === "restart"){
    if(!message.member.roles.has(modrole.id)){
      return
    } else {
      message.channel.send("Restarting...")
      client.destroy()
      client.login(config.botToken)
    }
  }

})

process.on('unhandledRejection', err => console.error(`Uncaught Promise Rejection: \n${err.stack}`));

client.login(config.botToken);

