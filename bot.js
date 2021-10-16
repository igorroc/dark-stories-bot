const Discord = require("discord.js")
const fs = require("fs")
const bot = new Discord.Client()
bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()
let config = require("./config.json")

const MENSAGEM_REINICIO = false

fs.readdir("./commands/", (err, files) => {
	if (err) console.log(err)

	let jsfile = files.filter((f) => f.split(".").pop() === "js") // Pega todos os nomes dos comandos da pasta "./commands/" e remove o '.js'
	if (jsfile.length <= 0) {
		return console.log("[LOGS] Não foi possível encontrar comandos!")
	}

	jsfile.forEach((f, i) => {
		let pull = require(`./commands/${f}`) // Importa cada arquivo
		bot.commands.set(pull.config.name, pull) // Coloca o nome dele na Collection
		console.log(
			`\n■▶ [STARTING] ⇥ Comando '${pull.config.name}' inicializado com sucesso`
		)
		pull.config.aliases.forEach((alias) => {
			bot.aliases.set(alias, pull.config.name) // Coloca a variação dele na Collection
			console.log(`↳ Variação '${alias}' adicionada`)
		})
	})
})

// ! =-=-=-=-=-=-=-=-=-=-=-=-=

bot.once("ready", () => {
	let mensagem = `■ Bot iniciado! ■`
	let barra = ""

	for (let i = 0; i < mensagem.length; i++) {
		barra += "■"
	}

	console.log(barra)
	console.log(mensagem)
	console.log(barra + "\n\n")

	if (config.status == "on") {
		bot.user.setStatus("online")
		bot.user.setActivity(`| dh!help para ajuda`, {
			type: "PLAYING",
		})
	} else {
		bot.user.setStatus("idle")
		bot.user.setActivity(`| Estão fazendo alterações em mim! |`, {
			type: "PLAYING",
		})
	}
})

bot.on("message", async (message) => {
	// ! Return if the author is a bot
	if (message.author.bot) return

	// ! Restart the config file
	delete require.cache[require.resolve("./config.json")]
	let config = require("./config.json")

	// ? Cleans the message
	let prefix = config.prefix
	let messageArray = message.content.split(" ")
	let comando = messageArray[0].slice(prefix.length)
	let args = messageArray.slice(1)

	// ! Return a message to ModChannel when someone sends a DM
	if (message.channel.type == "dm") {
		let anexo = message.attachments.first()?.attachment
		const embed = new Discord.MessageEmbed()
			.setColor("#64B3E3")
			.setTitle("\\💬 Mensagem recebida")
			.setDescription(
				anexo
					? `[anexo](${anexo.toString()})${anexo
							.toString()
							.slice(-4)}`
					: message.content.length < 1024
					? message.content
					: message.content.slice(0, 1015) + " [...]"
			)
			.addFields({
				name: `Enviado por:`,
				value: message.author || message.author.username,
				inline: false,
			})
			.setImage(
				anexo
					? anexo.toString().endsWith(".png")
						? anexo
						: null
					: null
			)
			.setTimestamp()

		return bot.channels.cache.get("722274694535053317").send(embed)
	}

	let emojiAgree = bot.emojis.cache.get("892486327080218684"),
		emojiDisagree = bot.emojis.cache.get("892486199233618041")

	if(message.channel.id == "696458021500354581"){ // Suggestion channel
		await message.react(emojiDisagree)
		await message.react(emojiAgree)
		console.log("New suggestion")
	}

	// ! Verify the prefix
	if (!message.content.startsWith(prefix)) return

	// ! Verify if there is a command
	if (!comando) return

	// ! Verify if the bot is set to be offline
	if (config.status == "off" && comando != "help" && comando != "config") {
		// Valida se o bot está online ou offline, liberando apenas o uso do comando config e help
		let off = "<:off:723707654245187665>"
		message.channel.send(
			`${off} Eu estou \` offline \`.\nProvavelmente estão **fazendo alterações** em mim!\n> Seja **paciente**!`
		)
		console.log(
			`⚫ Comando enviado por '${message.author.username}' enquanto o bot está OFF`
		)
	}

	// ! Retorna, caso o usuário esteja preso
	if (message.member.roles.cache.find((r) => r.id == "842189200337666058")) {
		const embed = new Discord.MessageEmbed()
			.setColor("#ff0000")
			.setTitle("\\🚫 Erro")
			.setDescription(
				"Você está **preso**, e **não** pode mais enviar comandos!"
			)
			.setTimestamp()

		return message.reply(embed)
	}

	// ! Run the command
	let commandfile =
		bot.commands.get(comando) || bot.commands.get(bot.aliases.get(comando)) // Pega o comando escrito no arquivo de comandos

	// ! Verifica se o comando existe
	if (commandfile) commandfile.run(bot, message, args)
	else {
		message.react(`❓`)
		console.log(`\n■▶ [LOGS] ⇥ Comando '${comando}' não encontrado`)
	}

})

let config = require("./config.json")
bot.login(config.token)
