import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/key.env'})
const token = process.env.CLIENT_TOKEN;
const roleGroup1 = process.env.GROUP1_ID!;
const roleGroup2 = process.env.GROUP2_ID!;
const roleGroup3 = process.env.GROUP3_ID!;

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
        let messageString: string = "Naruni-powered merchant search!\n";
        console.log("what's the groups?: " + groupByTime.get(returnHour));
        let groupArray: Array<string> = groupByTime.get(returnHour)!;
        groupArray.forEach(function (value){
            messageString += "Merchants online!\n" //<@&role_id>
            if(value === "group1")
            {
                messageString += "<@&" + roleGroup1 + "> Merchants: \n"
                + "**[Ben (Rethramis)]**:\n"
                + "Loghill - Loghill Outpost\nAnkumo Mountain - Border Watch\nRethramis Border - Regria Monastary\n"
                + "**[Peter (North Vern)]**:\n"
                + "Port Krona - Downtown Port Krona\nParna Forest - Parna's Sanctum\nFesnar Highland - Barrier Trail\nVernese Forest - Ranger HQ\nBalankar Mountains - Lighthouse Village\n"
                + "**[Laitir (Yorn)]**:\n"
                + "Yorn's Cradle - Glory Trade Plaza\nUnfinished Garden - Youthful Garden\nBlack Anvil Mine - Sleepy Shelter\nIron Hammer Mine - Radiant Gold Mine\nHall of Promise - Library Obscure\n"
                + "\n"
            }
            else if(value === "group2")
            {
                messageString += "<@&" + roleGroup2 + "> Merchants: \n"
                + "**[Lucas (Yudia)]**:\n"
                + "Ozhorn Hill - Ozhorn Assembly Area\nSaland Hill- Salt Works\n"
                + "**[Morris (East Luterra)]**:\n"
                + "Dyorika Plains - Bishu Manor\nSunbright Hill - Pumpkin Farm\nFlowering Orchard - Deier Village\n"
                + "**[Mac (Anikka)]**:\n"
                + "Delphi Township - Market District\nRattan Hill - Cold Haunted House\nMelody Forest - Ascetic Temple\nPrisma Valley - Beacon Point\nTwilight Mist - Cloud Valley\n"
                + "**[Jeffrey (Shushire)]**:\n"
                + "Icewing Cliff - Gray Wolves\nLake Eternity - Lakeside Fishing Spot\nFrozen Sea - Shadow Market\nIceblood Plateau - Graymoon Camp\nBitterwind Hill - Bitterwind Hill Post\n"
                + "**[Dorella (Feiton)]**:\n"
                + "Kalaja Village - Portal Statue\n"
                + "\n"
            }
            else if(value === "group3")
            {
                messageString += "<@&" + roleGroup3 + "> Merchants: \n"
                + "**[Malone (West Luterra)]**:\n"
                + "Battlebound Plains - Front Outpost\nBilbrin Forest - Spring Refugee Outpost\nMedrick Monastary - Medrick Monastary\nLakebar- Lakebar Village\nMount Zagoras - Zagoras Fortress\n"
                + "**[Burt (East Luterra)]**:\n"
                + "Blackrose Chapel - Styxia Village\nBorea's Domain - Borea Castle\nCroconys Seashore - Croconys Fishing Village\nLeyar Terrace - Tamir Village\n"
                + "**[Oliver (Tortoyk)]**:\n"
                + "Seaswept Woods - Cashew Forest\nSkyreach Steppe - Thumb Shores\nSweetwater Forest - Sweetwater Farm\nForest of Giants - Tortoyk's Arm\n"
                + "**[Nox (Arthetine)]**:\n"
                + "Riza Falls - Verdantier Observatory\nTotrich - Clockwork Square\nArid Path - Lupen Port\nScraplands - Relay Guard Post\nNebelhorn - Nebelhorn Lab\nWindbringer Hills - Guard Post\n"
                + "**[Aricer (Rohendel)]**:\n"
                + "Lake Shiverwave - Fairy Settlement\nXeneela Ruins - Contaminated Village\nBreezesome Brae - Dandelion Hill\nGlass Lotus Lake - Foehn Plains\nElzowin's Shade - West Knurlroot Forest\n"
                + "**[Rayni (Punika)]**:\n"
                + "Tika Tika Colony - Militia Residence\nTideshelf Path - Mellow Beach\nSecret Forest - Forlorn Swamps\nStarsand Beach - Starlight Shelter\n"
                + "\n"
            }
            //function fetchMerchantFromGroup: string = ""; //for now just group
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
let botChannelId: string = process.env.BOTCHANNEL_ID!;
let messageChannel = null;
let job = new CronJob('0 30 * * * *', function() {
    messageChannel = client.channels.cache.get(botChannelId) as Discord.TextChannel;
    messageChannel.send(formattedMessage(new Date())); 
}, null, true);
job.start();

client.on('messageReactionAdd', (reaction, user) =>{
    let authorName = reaction.message.author!.username!;
    
    if(authorName === "Moving Mokoko")
    {
        if(reaction.emoji.name === "1️⃣")
        {
            reaction.message.guild!.members.cache.get(user.id)!.roles.add(roleGroup1);
        }
        else if(reaction.emoji.name === "2️⃣")
        {
            reaction.message.guild!.members.cache.get(user.id)!.roles.add(roleGroup2);
        }
        else if(reaction.emoji.name === "3️⃣")
        {
            reaction.message.guild!.members.cache.get(user.id)!.roles.add(roleGroup3);
        }
    }

});
//this will trigger on every message, how to make it on specific message?

client.on('messageReactionRemove', (reaction, user) =>{
    let authorName = reaction.message.author!.username;
    if(authorName === "Moving Mokoko")
    {
        if(reaction.emoji.name === "1️⃣")
            reaction.message.guild!.members.cache.get(user.id)!.roles.remove(roleGroup1);
        else if(reaction.emoji.name === "2️⃣")
            reaction.message.guild!.members.cache.get(user.id)!.roles.remove(roleGroup2);
        else if(reaction.emoji.name === "3️⃣")
            reaction.message.guild!.members.cache.get(user.id)!.roles.remove(roleGroup3);
    }
    //does this mean anyone with username Moving Mokoko can trigger?
});


let introductionChannelId: string = process.env.INTRODUCTION_CHANNEL_ID!;
client.on('ready', () => {
    let introductionMessage: string = "Hello, I'm a moving mokoko. Traveling merchants are divided into 3 groups.\n\n"
    + "**Group 1**: Ben (Rethramis) | Peter (North Vern) | Laitir (Yorn)\n"
    + "**Group 2**: Lucas (Yudia) | Morris (East Luterra) | Mac (Anikka) | Jeffery (Shushire) | Dorella (Feiton)\n"
    + "**Group 3**: Malone (West Luterra) | Burt (East Luterra) | Oliver (Totoroyk) | Nox (Arthetine) | Aricer (Rohendel) | Rayni (Punika)\n\n"
    + "If you are searching for the Seria card (Lostwind Cliff set), only Burt (group 3) has a chance of selling it.\n\n"
    + "React with :one: / :two: / :three: below and I will ping you when it is time for the respective group to spawn!";
    console.log("ready to go")
    messageChannel = client.channels.cache.get(introductionChannelId) as Discord.TextChannel;
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