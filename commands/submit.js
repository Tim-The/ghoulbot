const Discord = require("discord.js");
const utils = require("../utils");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {
  if(message.channel.id !== utils.submissionChannel){
    return
  }
  if(!args[0]){
    return message.channel.send("Provide me what to submit!")
  }
  if(args[0].startsWith("http")){
    return message.channel.send("Provide a name for the emote.")
  }
  if(!args[1]){
    return message.channel.send("Provide a link of the emote.")
  }
  if(!args[1].startsWith("http")){
    return message.channel.send("Provide a valid link of the emote.")
  } else{
    let reportID = await db.fetch('reportID')
       if(reportID != null){
         await db.add('reportID', 1)
       }
       else{
          await db.set('reportID', 1)
       }
     }
    if(!args[2]){
      message.react("👀")
    message.channel.send("Your emote has been sent to the Ghoulers for approval!").then(m => m.delete(20000))
    db.fetch("reportID").then(number => {
      client.channels.get(utils.logChannel).send(`<:approve:${utils.approveEmote}> \`${args[0]}\` Submitted by ${message.author}. Submission ID: (\`#${number}\`)`)
      client.channels.get(utils.queueChannel).send(`-------------------------------\nThe following ghoul-mote requires approval:\n**Submitted by:** ${message.author}\n**Name:** \`${args[0]}\`\n**Link:** ${args[1]}\n**Submission ID:** #${number}\n-------------------------------`).then(msg => {
      msg.react(utils.denyEmote)
      msg.react(utils.approveEmote)
    })
    }) 
  } else if(args[2]){
      let comment = args.slice(2).join(" ")
      message.react("👀")
    message.channel.send("Your emote has been sent to the Ghoulers for approval!").then(m => m.delete(20000))
    db.fetch("reportID").then(number => {
      client.channels.get(utils.logChannel).send(`<:approve:${utils.approveEmote}> \`${args[0]}\` Submitted by ${message.author}. Submission ID: (\`#${number}\`)`)
      client.channels.get(utils.queueChannel).send(`-------------------------------\nThe following ghoul-mote requires approval:\n**Submitted by:** ${message.author}\n**Name:** \`${args[0]}\`\n**Link:** ${args[1]}\n**Comment:** ${comment}\n**Submission ID:** #${number}\n-------------------------------`).then(msg => {
      msg.react(utils.denyEmote)
      msg.react(utils.approveEmote)
      })
    })
  }
}
  

module.exports.help = {
  name: "submit"
}
