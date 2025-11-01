const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bane um usuário do servidor')
        .addUserOption(option =>
            option.setName('usuario')
                  .setDescription('Escolha o usuário para banir')
                  .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                  .setDescription('Motivo do banimento')
                  .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const motivo = interaction.options.getString('motivo') || 'Sem motivo fornecido';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({
                content: '<a:E_No:1422757363693387856> Usuário não encontrado no servidor.',
                ephemeral: true
            });
        }

        if (!member.bannable) {
            return interaction.reply({
                content: '<a:E_No:1422757363693387856> Não posso banir este usuário.',
                ephemeral: true
            });
        }''

        await member.ban({ reason: motivo });

        await interaction.reply({
            content: `<a:E_Verificado:1422757367501557891 **${user.tag}** foi banido com sucesso!`
        });
    },
};