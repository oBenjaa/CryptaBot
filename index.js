require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('✅ Bot do Discord está online!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: ['CHANNEL']
});

client.commands = new Collection();

const getCommandFiles = dir => {
    let commandFiles = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
           
            commandFiles = commandFiles.concat(getCommandFiles(fullPath));
        } else if (file.endsWith('.js')) {
            commandFiles.push(fullPath);
        }
    }

    return commandFiles;
};

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getCommandFiles(commandsPath);

for (const file of commandFiles) {
    try {
        const command = require(file);

        if (!command.data || !command.data.name) {
            console.log(`⚠️ O arquivo "${file}" está com problema — faltando "data" ou "name". Pulando...`);
            continue;
        }

        client.commands.set(command.data.name, command);
        console.log(`✅ Carregado comando: ${command.data.name}`);
    } catch (err) {
        console.error(`❌ Erro ao carregar o comando "${file}":`, err);
    }
}

client.once('ready', () => {
    console.log(`${client.user.tag} está online!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Erro ao executar o comando ${interaction.commandName}:`, error);
        await interaction.reply({ content: '<a:E_No:1422757363693387856> Ocorreu um erro ao executar o comando!', ephemeral: true });
    }
});

client.login(process.env.BOT_TOKEN);
