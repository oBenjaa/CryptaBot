const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Mostra o banner de um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Selecione um usuário')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;

        try {
            
            const userFetch = await interaction.client.users.fetch(user.id, { force: true });

            const bannerURL = userFetch.bannerURL({ size: 4096, dynamic: true });

            if (!bannerURL) {
                return interaction.reply({
                    content: `<a:E_No:1422757363693387856> Este usuário **${user.username}** não possui um banner definido.`,
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`Banner de ${user.username}`)
                .setImage(bannerURL)
                .setColor('Random')
                .setFooter({ text: `ID: ${user.id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '<a:E_No:1422757363693387856>  Ocorreu um erro ao tentar buscar o banner.',
                ephemeral: true
            });
        }
    }
};