import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/key.env'})
const token = process.env.CLIENT_TOKEN;

const intents = new Discord.Intents();
intents.add(Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
//  * @property {IntentsResolvable} intents Intents to enable for this connection
const client = new Discord.Client({ intents });
//Groups rotate AM and PM, don't worry about minute because it is always going to be at the 30. cronjob will take care of that
//groupByTime: hour, group. cronjob will handle the minute alignment
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

let CronJob = require('cron').CronJob;

function formattedMessage(systime: Date): string //should return string and job should just output formatted message
{
    let returnTime = systime.toLocaleTimeString('en-US'); //make sure time is in consistent format
    //get substring from start until the first ':' character.
    //in US locale that will be the hours
    let returnHour: string = returnTime.substring(0, returnTime.indexOf(":"));
    console.log("what's the hour?: " + returnHour);
    if(groupByTime.has(returnHour))
    {
        let messageString: string = "mokoko powered init\n";
        console.log("what's the groups?: " + groupByTime.get(returnHour));
        let groupArray: Array<string> = groupByTime.get(returnHour)!;
        groupArray.forEach(function (value){
            messageString += "@" + value + " Merchants online!\n" //<@&role_id>
            let fetchMerchantFromGroup: string = ""; //for now just group
            //if group blah print this if group blah print that
        });
        return messageString;
    }
    else{ 
        console.log("hour not found");
        return "";
    }
}

//cron will run every minute just for sanity checking
// https://crontab.guru/#30_*_*_*_*    
//wonder if there is a way to get channel Id by name, if it doesn't exist, create channel with name and pull channelId from there.
//probably is. but for now, into env you go
//define channel as textchannel through calling TextChannel
//let member = Discord.GuildMember;
let channelId: string = process.env.CHANNEL_ID!;
let messageChannel = null;
let job = new CronJob('0 * * * * *', function() {
    console.log('sanity check');
    messageChannel = client.channels.cache.get(channelId) as Discord.TextChannel;
    messageChannel.send(formattedMessage(new Date())); 
}, null, true);
job.start();

client.on('messageReactionAdd', (reaction, user) =>{
    if(reaction.emoji.name === "1️⃣")
        console.log('reacted1');
    else if(reaction.emoji.name === "2️⃣")
        console.log('reacted2');
    else if(reaction.emoji.name === "3️⃣")
        console.log('reacted3');
});
//this will trigger on every message, how to make it on specific message?

client.on('messageReactionRemove', (reaction, user) =>{
    if(reaction.emoji.name === "1️⃣")
        console.log('redacted1');
    else if(reaction.emoji.name === "2️⃣")
        console.log('redacted2');
    else if(reaction.emoji.name === "3️⃣")
        console.log('redacted3');
});

client.on('ready', () => {
    let introductionMessage: string = "Hello, I'm a moving mokoko. Traveling merchants are divided into 3 groups.\n\n"
    + "Group 1: Ben (Rethramis) | Peter (North Vern) | Laitir (Yorn)\n"
    + "Group 2: Lucas (Yudia) | Morris (East Luterra) | Mac (Anikka) | Jeffery (Shushire) | Dorella (Feiton)\n"
    + "Group 3: Malone (West Luterra) | Burt (East Luterra) | Oliver (Totoroyk) | Nox (Arthetine) | Aricer (Rohendel) | Rayni (Punika)\n\n"
    + "If you are searching for the Seria card (Lostwind Cliff set), only Burt (group 3) has a chance of selling it.\n\n"
    + "React with :one: / :two: / :three: below and I will ping you when it is time for the respective group to spawn!";
    console.log("ready to go")
    messageChannel = client.channels.cache.get(channelId) as Discord.TextChannel;
    messageChannel.send(introductionMessage);
});

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