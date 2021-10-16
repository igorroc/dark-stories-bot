const Discord = require("discord.js")
let config = require("../config.json")
let pr = config.prefix

module.exports.run = async (bot, message, args) => {
	console.log(
		`\n■▶ [LOGS] ⇥ Usuário '${message.author.username}' usou o comando Enviar`
	)

	const embed = new Discord.MessageEmbed()
		.setTitle("Envie sua própria história!")
		.setColor("#FFC83D")
		.setDescription(
			"Faça o envio de sua história para ser adicionada ao bot!\nVocê deverá enviar como texto a estrutura de sua história (título, descrição, resposta, etc) uma por uma, a medida que eu for pedindo."
		)

	message.channel.send(embed)
}

module.exports.config = {
	name: "enviar",
	description: "Envie a sua história para ser adicionada ao bot!",
	usage: `${pr}enviar`,
	accessableby: "Membros",
	aliases: ["create", "send"],
}
