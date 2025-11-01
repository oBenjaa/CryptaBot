const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove o castigo  de um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para desmutar')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        if (!interaction.guild) {
            return interaction.reply({ content: '<a:E_No:1422757363693387856> Este comando só pode ser usado em servidor.', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(user.id) ?? await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
            return interaction.reply({
                content: '<a:E_No:1422757363693387856> Este  usuário não encontrado no servidor.',
                ephemeral: true
            });
        }

        const muteRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
        if (!muteRole) {
            return interaction.reply({
                content: '<a:E_No:1422757363693387856> Nenhum  cargo "Muted" foi encontrado neste servidor.',
                ephemeral: true
            });
        }

        if (!member.roles.cache.has(muteRole.id)) {
            return interaction.reply({
                content: `<a:E_No:1422757363693387856> O usuário <@${user.id}> não está castigado(a).`,
                ephemeral: true
            });
        }

        try {
            await member.roles.remove(muteRole);
        } catch (err) {
            console.error('Erro ao remover o mute:', err);
            return interaction.reply({ content: '<a:E_No:1422757363693387856> Não consegui remover o castigo deste usuário.', ephemeral: true });
        }

        await interaction.reply({
            content: `<a:E_Verificado:1422757367501557891> O usuário <@${user.id}> foi retirado o castigo com sucesso!`
        });

        try {
            await member.send(`<a:E_Verificado:1422757367501557891> Você foi desmutado em **${interaction.guild.name}**.`);
        } catch (err) {
            console.log('Não consegui enviar DM ao usuário desmutado.');
        }
    },
};