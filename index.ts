import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/key.env'})
const token = process.env.CLIENT_TOKEN;

//Groups rotate AM and PM
const group1: Array<string> = ["03:30", "4:30", "6:30", "7:30", "10:30", "12:30"];
const group2: Array<string> = ["01:30", "4:30", "5:30", "7:30", "8:30", "11:30"];
const group3: Array<string> = ["02:30", "5:30", "6:30", "8:30", "9:30", "12:30"];
console.log(group1[0] + " " + group2[0] + " " + group3[0]);

const intents = new Discord.Intents();
intents.add(Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
//  * @property {IntentsResolvable} intents Intents to enable for this connection
const client = new Discord.Client({ intents });

client.on('message', msg => {
    if (msg.content === 'ping')
    {
        msg.reply('Pong!');
    }
  });

client.login(token).then(() => {
    console.log("login successful")
}); //login bot using token