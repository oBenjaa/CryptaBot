const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

function getCommandFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of list) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(getCommandFiles(filePath)); 
        } else if (file.isFile() && file.name.endsWith('.js')) {
            results.push(filePath);
        }
    }

    return results;
}

const commandFiles = getCommandFiles(commandsPath);

if (commandFiles.length === 0) {
    console.warn('Nenhum arquivo de comando encontrado!');
}

for (const file of commandFiles) {
    const command = require(file);

    console.log(`📄 Carregando comando: ${path.relative(commandsPath, file)} -> ${command.data?.name || 'SEM NOME'}`);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`Ocorreu um erro vefirique se está na pasta certa o comando ${file}!`);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || process.env.BOT_TOKEN);

(async () => {
    try {
        console.log(`🔁 Registrando ${commands.length} comandos no servidor ${process.env.GUILD_ID}...`);

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('✅ Comandos registrados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error);
    }
})();