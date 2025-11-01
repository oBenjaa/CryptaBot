const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Mostra o ping do bot!'),
    async execute(interaction) {
        
        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setDescription(`O ping do bot é **${interaction.client.ws.ping}ms**`)
            .setColor('#ff0000');

        await interaction.reply({ embeds: [embed] });
    },
};