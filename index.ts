import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/key.env'})
const token = process.env.CLIENT_TOKEN;

//Groups rotate AM and PM, don't worry about minute because it is always going to be at the 30. cronjob will take care of that
const group1: Array<string> = ["3", "4", "6", "7", "10", "12"];
const group2: Array<string> = ["1", "4", "5", "7", "8", "11"];
const group3: Array<string> = ["2", "5", "6", "8", "9", "12"];
//don't do this ^, make a hashmap with time as key and groups as value
let groupByTime: Map<string, string[]> = new Map([
    ["1", ["group2"]],
    ["2",["group3"]],
    ["3",["group1"]],
    ["4",["group1", "group2"]],
    ["5",["group2", "group3"]],
    ["6",["group1", "group3"]],
    ["7",["group1", "group2"]],
    ["8",["group2", "group3"]],
    ["9",["group3"]],
    ["10",["group1"]],
    ["11",["group2"]],
    ["12",["group1", "group3"]],
]);

const intents = new Discord.Intents();
intents.add(Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
//  * @property {IntentsResolvable} intents Intents to enable for this connection
const client = new Discord.Client({ intents });

let CronJob = require('cron').CronJob;

function formattedMessage(systime: Date): Array<string>
{
    let returnTime = systime.toLocaleTimeString('en-US'); //make sure time is in consistent format
    //get substring from start until the first ':' character.
    //in US locale that will be the hours
    let returnHour: string = returnTime.substring(0, returnTime.indexOf(":"));
    console.log("what's the hour?: " + returnHour);
    if(groupByTime.has(returnHour))
    {
        console.log("what's the groups?: " + groupByTime.get(returnHour));
        return groupByTime.get(returnHour)!;
    }
    else{
        console.log("hour not found");
        return [] as string[];
    }
}

//cron will run every minute just for sanity checking
// https://crontab.guru/#30_*_*_*_*

let job = new CronJob('0 * * * * *', function() {
    console.log('sanity check');

    //wonder if there is a way to get channel Id by name, if it doesn't exist, create channel with name and pull channelId from there.
    //probably is. but for now, into env you go
    let messageToSend: string = "Merchants online! Groups: ";
    //define channel as textchannel through calling TextChannel
    let channelId: string = process.env.CHANNEL_ID!;
    const messageChannel = client.channels.cache.get(channelId) as Discord.TextChannel;
    let groupArray: Array<string> = formattedMessage(new Date());
    
    groupArray.forEach(function (value){
        messageToSend = messageToSend + (value);
    });
    messageChannel.send(messageToSend); 
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