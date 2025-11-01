const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Apaga uma quantidade de mensagens do canal. (Máximo de 14 dias)')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Número de mensagens a apagar (1-100)')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Apagar mensagens apenas de um usuário específico (opcional)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const quantidade = interaction.options.getInteger('quantidade');
        const usuario = interaction.options.getUser('usuario');
        const canal = interaction.channel;

        if (quantidade < 1 || quantidade > 100) {
            return interaction.reply({
                content: '<a:E_No:1422757363693387856> Você deve informar um número entre `1` e `100`.',
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const mensagens = await canal.messages.fetch({ limit: 100 });
            let deletadas;

            if (usuario) {
                const filtradas = mensagens.filter(msg => msg.author.id === usuario.id).first(quantidade);
                deletadas = await canal.bulkDelete(filtradas, true);
            } else {
                deletadas = await canal.bulkDelete(quantidade, true);
            }

            await interaction.editReply({
                content: `<a:E_Verificado:1422757367501557891> Foram apagadas **${deletadas.size}** mensagens${usuario ? ` de ${usuario.tag}` : ''}.`
            });

        } catch (err) {
            console.error('Erro ao limpar mensagens:', err);
            await interaction.editReply({
                content: '<a:E_No:1422757363693387856> Ocorreu um erro ao tentar apagar as mensagens. Verifique se as mensagens têm menos de 14 dias.',
            });
        }
    },
};