const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Mostra informações sobre um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                  .setDescription('Escolha o usuário')
                  .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setTitle(`Informações de ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Username', value: `${user.tag}`, inline: true },
                { name: 'ID', value: `${user.id}`, inline: true },
                { name: 'Bot', value: `${user.bot ? 'Sim' : 'Não'}`, inline: true },
                { name: 'Conta criada em', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
                { name: 'Entrou no servidor em', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'Não encontrado', inline: false },
            )
            .setColor('#ff0000') 
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};