const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa um usuário do servidor')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Escolha o usuário para expulsar')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({
                content: '<a:E_No:1422757363693387856> Usuário não encontrado no servidor.',
                ephemeral: true
            });
        }

        if (!member.kickable) {
            return interaction.reply({
                content: '<a:E_No:1422757363693387856> Não posso expulsar este usuário.',
                ephemeral: true
            });
        }

        await member.kick();

        await interaction.reply({
            content: `<a:E_Verificado:1422757367501557891> **${user.tag}** foi expulso com sucesso!`
        });
    },
};