const Discord = require("discord.js")
let config = require("../config.json")
let pr = config.prefix

module.exports.run = async (bot, message, args) => {
	console.log(
		`\n■▶ [LOGS] ⇥ Usuário '${message.author.username}' usou o comando ComoJogar`
	)

	const embed = new Discord.MessageEmbed()
		.setTitle(`Como jogar Dark Stories?`)
		.setColor("#52D37F")
		.setDescription(
			`Dark Stories é um jogo de enigma onde o objetivo é descobrir o que realmente aconteceu naquela história.\nA pessoa que utilizar o comando \`${pr}jogar\` será o narrador da história, e receberá a solução pela DM do Discord.`
		)
		.addField(
			"Pessoas",
			"Dark Stories deve ser jogado em grupo.\nUma pessoa, designada como narradora, escolhe um enigma e lê sua descrição em voz alta."
		)
		.addField(
			"Respostas",
			"Apenas o narrador sabe a solução (recebido por DM). Os jogadores devem fazer perguntas ao narrador, que só pode responder com **sim**, **não** ou **irrelevante**."
		)
		.addField(
			"Dicas",
			"Cabe ao narrador dar dicas, e aceitar as respostas dos jogadores"
		)
		.addField(
			"Dificuldade",
			"Os níveis de dificuldade é indicado por cores nas mensagens, divididos em 3 níveis: fácil (verde), médio (amarelo) e difícil (vermelho)."
		)

	message.channel.send(embed)
}

module.exports.config = {
	name: "comojogar",
	description: "Tutorial para como jogar o jogo Dark Stories",
	usage: `${pr}comojogar`,
	accessableby: "Membros",
	aliases: ["howtoplay"],
}
