const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mensagem')
        .setDescription('O bot repete a mensagem que você mandar')
        .addStringOption(option =>
            option.setName('mensagem')
                  .setDescription('Mensagem que o bot deve enviar')
                  .setRequired(true)
        ),
    async execute(interaction) {
        const mensagem = interaction.options.getString('mensagem');

     
        await interaction.channel.send(mensagem);

        
        await interaction.reply({ content: 'Mensagem enviada com sucesso!', ephemeral: true });
    },
};