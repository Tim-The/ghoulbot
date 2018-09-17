const Discord = require("discord.js");
const utils = require("../utils")

module.exports.run = async (client, message, args) => {
    let ghoulonecount = message.guild.emojis.size
    let gettwo = client.guilds.get("478353358038761472")
    let onemember = message.guild.memberCount
    let twomember = gettwo.memberCount
    let ghoultwocount = gettwo.emojis.size
    let totalmembercount = onemember + twomember
    let totalcount = ghoulonecount + ghoultwocount
    let statsembed = new Discord.RichEmbed()
    .addField("Stats", `<:ghoulcheer:475729185206435855> We are at ${totalcount} Ghoul-Motes in total\n<:ghoulawauu:491244593556488203> The servers together in total have ${totalmembercount} members`)
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
    .setTimestamp()

    message.channel.send(statsembed)

}

module.exports.help = {
    name: "stats"
}