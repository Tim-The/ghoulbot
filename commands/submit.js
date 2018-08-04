const Discord = require("discord.js");
const utils = require("../utils");
const config = require("../config");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {
  if(message.channel.id !== utils.submissionChannel){
    return
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
    reportID = await db.fetch('reportID')
       if(reportID != null){
         await db.add('reportID', 1)
       }
       else{
          await db.set('reportID', 1)
       }
     }
    message.react("👀")
    message.channel.send("Your emote has been sent to the Ghoulers for approval!").then(m => m.delete(5000))
    db.fetch("reportID").then(number => {
      client.channels.get(utils.logChannel).send(`<:approve:475044157904125962> \`${args[0]}\` Submitted by ${message.author}. Submission ID: (\`#${number}\`)`)
      client.channels.get(utils.queueChannel).send(`-------------------------------\n**The following ghoul-mote requires approval:**\n**Submitted by:** ${message.author}\n**Name:** \`${args[0]}\`\n**Link:** ${args[1]}\n**Submission ID:** #${number}\n-------------------------------`).then(msg => {
      msg.react(utils.denyEmote)
      msg.react(utils.approveEmote)
    })
    })
  }

module.exports.help = {
  name: "submit"
}
