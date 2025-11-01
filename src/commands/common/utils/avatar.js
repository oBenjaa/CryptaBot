const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Mostra o avatar de um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                  .setDescription('Escolha o usuário para ver o avatar')
                  .setRequired(false)
        ),
    async execute(interaction) {
        
        const user = interaction.options.getUser('usuario') || interaction.user;

        
        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${user.username}`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor('#fd0000'); 

        await interaction.reply({ embeds: [embed] });
    },
};