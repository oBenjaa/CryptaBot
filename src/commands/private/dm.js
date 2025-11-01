const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Envia uma mensagem privada para um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para quem enviar a DM')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('Mensagem que o bot deve enviar')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario');
        const mensagem = interaction.options.getString('mensagem');

        try {
            await usuario.send(mensagem);
            await interaction.reply({
                content: `<a:E_Verificado:1422757367501557891> Enviei a DM para ${usuario.tag} com sucesso!`,
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
    content: '<a:E_No:1422757363693387856> Não foi possível enviar uma mensagem direta para este usuário.',
    ephemeral: true
    });

        }
    },
};