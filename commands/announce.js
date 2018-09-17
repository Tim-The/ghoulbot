const Discord = require("discord.js");
const utils = require("../utils")

module.exports.run = async (client, message, args) => {
    var protectorrole = message.guild.roles.find(`name`, utils.modRoleName)
    if(!message.member.roles.has(protectorrole)){
    return message.channel.send("*purr* You bad kitty, shame on you for trying this command with no permissions.")
    }
    if(!args[0]){
        return message.channel.send("Naughty kitty, give me something to announce!")
    }
    let theanoot = args.join(" ");
    let announcementchannel = client.channels.get(utils.announceChannel)
    message.channel.send("*meow* <:ghoulawauu:491244593556488203> I sent the important info on it's way!")
    announcementchannel.send(theanoot)
}

module.exports.help = {
    name: "announce"
}