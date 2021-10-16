const Discord = require("discord.js")
const fetch = require("node-fetch")

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
				`https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg`
			)
			.setFooter(`Mestre: ${message.author || message.author.user || message.author.username}`)

		const resposta = new Discord.MessageEmbed()
			.setTitle(`#${jsonJogo.id} - ${jsonJogo.title}`)
			.setDescription(jsonJogo.description)
			.setColor(difficultyColor[jsonJogo.difficulty - 1])
			.setImage(
				`https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg`
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
	description: "Inicia um jogo com você como mestre!",
	usage: "dh!play (opções)\ndh!play texto",
	accessableby: "Membros",
	aliases: ["start", "jogar"],
}
