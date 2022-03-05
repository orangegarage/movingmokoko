import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/key.env'})
const token = process.env.CLIENT_TOKEN;

//Groups rotate AM and PM
const group1: Array<string> = ["03:30", "4:30", "6:30", "7:30", "10:30", "12:30"];
const group2: Array<string> = ["01:30", "4:30", "5:30", "7:30", "8:30", "11:30"];
const group3: Array<string> = ["02:30", "5:30", "6:30", "8:30", "9:30", "12:30"];

const intents = new Discord.Intents();
intents.add(Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
//  * @property {IntentsResolvable} intents Intents to enable for this connection
const client = new Discord.Client({ intents });

let CronJob = require('cron').CronJob;

function formattedMessage(systime: Date)
{
    let returnValue = systime.toLocaleString();
    return returnValue;
}

//cron will run every minute just for sanity checking
// https://crontab.guru/#30_*_*_*_*

let job = new CronJob('0 * * * * *', function() {
    console.log('sanity check');
    console.log(formattedMessage(new Date()));
    //define channel as textchannel
    //wonder if there is a way to get channel Id by name, if it doesn't exist, create channel with name and pull channelId from there.
    //probably is. but for now, into env you go
    const messageChannel = client.channels.cache.get(process.env.CHANNEL_ID) as Discord.TextChannel;
    messageChannel.send(formattedMessage(new Date())); 
}, null, true);
job.start();

console.log(group1[0] + " " + group2[0] + " " + group3[0]);

client.on('ready', () => console.log("ready to go"));

client.on('messageCreate', msg => {
    if (msg.content === 'mokoko')
    {
        msg.reply('Mokoko my nuts\ngottemmm :relieved:');
    }
  });

// Cron: every time minute is 30, look at hour and all 3 groups
// find the groups that have the time and add group numbers to bitmask << probably unnecessary for only 3 rotations
// just add group numbers to array
// go to JSON and pull information of merchants in corresponding groups
// print

client.login(token).then(() => {
    console.log("login successful")
}); //login bot using token