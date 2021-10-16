const Discord = require("discord.js")
const fetch = require("node-fetch")
let config = require("../config.json")
let pr = config.prefix


module.exports.run = async (bot, message, args) => {
	console.log(
		`\n■▶ [LOGS] ⇥ Usuário '${message.author.username}' usou o comando Play`
	)

	let jsonJogo = await getJogo()

	let difficultyColor = ["#52D37F", "#FFC83D", "#D85452"]

	console.log(jsonJogo)
	if (jsonJogo) {
		const jogo = new Discord.MessageEmbed()
			.setTitle(jsonJogo.title)
			.setURL("https://discord.com/channels/@me/898993063765082173")
			.setDescription(jsonJogo.description)
			.setColor(difficultyColor[jsonJogo.difficulty - 1])
			.setImage(
				`https://raw.githubusercontent.com/igorroc/dark-stories/master/assets/${jsonJogo.image}`
			)
			.setFooter(`Narrador(a): ${message.author.tag}`)

		const resposta = new Discord.MessageEmbed()
			.setTitle(`#${jsonJogo.id} - ${jsonJogo.title}`)
			.setDescription(jsonJogo.description)
			.setColor(difficultyColor[jsonJogo.difficulty - 1])
			.setImage(
				`https://raw.githubusercontent.com/igorroc/dark-stories/master/assets/${jsonJogo.image}`
			)
			.addField("Resposta:", jsonJogo.answer)
			.setFooter(`Dificuldade: ${jsonJogo.difficulty}/3`)

		let msgServer = await message.channel.send(jogo)

		resposta.setURL(msgServer.url)
		await message.author.send(resposta)
	} else {
		const erro = new Discord.MessageEmbed()
			.setTitle("❌ Erro")
			.setDescription(
				"Não foi possível encontrar uma história. Caso o problema persista, fale com um moderador."
			)
			.setColor(difficultyColor[2])
		message.channel.send(erro)
	}
}

async function getJogo(file) {
	let jsonFile
	await fetch("https://dark-stories.vercel.app/api/story")
		.then((response) => {
			if (!response.ok) {
				throw new Error("HTTP error " + response.status)
			}
			return response.json()
		})
		.then((json) => {
			jsonFile = json
		})
		.catch(function (e) {
			console.error("ERROOO", e)
		})

	return jsonFile
}

module.exports.config = {
	name: "play",
	description: "Inicia um jogo com você como Narrador(a)!",
	usage: `${pr}play (opções)\n${pr}play texto`,
	accessableby: "Membros",
	aliases: ["start", "jogar"],
}
