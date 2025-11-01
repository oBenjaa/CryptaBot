const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Silencia um usuário temporariamente.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Escolha o usuário para mutar.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('tempo')
                .setDescription('Tempo do mute (ex: 10m, 2h, 1d).')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const tempo = interaction.options.getString('tempo');
        const member = interaction.guild.members.cache.get(user.id) ?? await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!interaction.guild) {
            return interaction.reply({ content: '<a:E_No:1422757363693387856> Este comando só pode ser usado em um servidor.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: '<a:E_No:1422757363693387856> Usuário não encontrado no servidor.', ephemeral: true });
        }

        if (!member.moderatable || member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: '<a:E_No:1422757363693387856> Não posso mutar este usuário.', ephemeral: true });
        }

        const timeMs = parseTime(tempo);
        if (!timeMs) {
            return interaction.reply({ content: '<a:E_No:1422757363693387856> Tempo inválido! Use por exemplo `10m`, `2h`, `1d`.', ephemeral: true });
        }

        try {
            await member.timeout(timeMs, `Mutado por ${interaction.user.tag} por ${tempo}`);
        } catch (err) {
            console.error('Erro ao aplicar mute:', err);
            return interaction.reply({ content: '<a:E_No:1422757363693387856> Não foi possível castigar este usuário. Verifique o tempo!    ', ephemeral: true });
        }

        await interaction.reply({
            content: `<a:E_Verificado:1422757367501557891> O usuário <@${user.id}> foi mutado por **${tempo}**!`
        });

        try {
            await member.send(`<a:E_Verificado:1422757367501557891> Você foi mutado em **${interaction.guild.name}** por **${tempo}**.`);
        } catch {
            
        }
    },
};

function parseTime(str) {
    const match = str.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return null;
    const num = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case 's': return num * 1000;
        case 'm': return num * 60 * 1000;
        case 'h': return num * 60 * 60 * 1000;
        case 'd': return num * 24 * 60 * 60 * 1000;
        default: return null;
    }
}