const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Le bot est en ligne !'));
app.listen(process.env.PORT || 3000);const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = '&';

client.once('ready', () => {
    console.log(`Bot Utils connecté en tant que ${client.user.tag} !`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'clear') {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply("Tu n'as pas la permission `Gérer les messages` pour utiliser cette commande.")
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount)) {
            return message.reply("Il faut indiquer un nombre ! Exemple : `&clear 10`")
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        if (amount < 1 || amount > 100) {
            return message.reply("Tu peux uniquement supprimer entre 1 et 100 messages à la fois.")
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        try {
            await message.delete();
            const deleted = await message.channel.bulkDelete(amount, true);
            
            const reply = await message.channel.send(`✅ ${deleted.size} messages ont été supprimés.`);
            setTimeout(() => reply.delete(), 4000);

        } catch (error) {
            console.error(error);
            message.channel.send("Une erreur est survenue (les messages de plus de 14 jours ne peuvent pas être supprimés).")
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
