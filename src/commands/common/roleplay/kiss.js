const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const gifs = [
    "https://tenor.com/pt-BR/view/ichigo-hiro-anime-kiss-anime-gif-8146116001988818857",
    "https://tenor.com/pt-BR/view/horimiya-animes-anime-shoujo-shounen-romance-boy-girl-gif-17793070781933240295",
    "https://tenor.com/pt-BR/view/mst-gif-26437561",
    "https://tenor.com/pt-BR/view/funny-gif-8770969296920752114"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Beije outro usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Quem você quer beijar?')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const author = interaction.user;

        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        
        if (user.id === author.id) {
            const selfEmbed = new EmbedBuilder()
                .setColor(0xff69b4)
                .setDescription(`**${author.username}** se beijou?`)
                .setImage(randomGif)
                .setTimestamp();

            return interaction.reply({ embeds: [selfEmbed] });
        }

        
        const embed = new EmbedBuilder()
            .setColor(0xff69b4)
            .setDescription(`💋 **${author}** beijou **${user}**!`)
            .setImage(randomGif)
            .setTimestamp();

        
        const retribuirBtn = new ButtonBuilder()
            .setCustomId('retribuir')
            .setLabel('Retribuir')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(retribuirBtn);

        const reply = await interaction.reply({ embeds: [embed], components: [row] });

        
        const collector = reply.createMessageComponentCollector({ time: 300000 }); 

        collector.on('collect', async i => {
            if (i.customId === 'retribuir') {
                if (i.user.id !== user.id) {
                    return i.reply({
                        content: '❌ Só quem recebeu o beijo pode retribuir!',
                        ephemeral: true
                    });
                }

                const retribuirEmbed = new EmbedBuilder()
                    .setColor(0xff69b4)
                    .setDescription(`💞 **${user}** retribuiu o beijo de **${author}**!`)
                    .setImage(randomGif)
                    .setTimestamp();

                await i.reply({ embeds: [retribuirEmbed] });

                
                const disabledBtn = ButtonBuilder.from(retribuirBtn).setDisabled(true);
                const disabledRow = new ActionRowBuilder().addComponents(disabledBtn);
                await reply.edit({ components: [disabledRow] });

                collector.stop();
            }
        });
    }
};