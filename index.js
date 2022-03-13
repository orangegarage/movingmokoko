"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
var dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/key.env' });
var token = process.env.CLIENT_TOKEN;
var roleGroup1 = process.env.GROUP1_ID;
var roleGroup2 = process.env.GROUP2_ID;
var roleGroup3 = process.env.GROUP3_ID;
var intents = new Discord.Intents();
intents.add(Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
//  * @property {IntentsResolvable} intents Intents to enable for this connection
var client = new Discord.Client({ intents: intents });
//Groups rotate AM and PM, don't worry about minute because it is always going to be at the 30. cronjob will take care of that
//groupByTime: hour, group. cronjob will handle the minute alignment
var groupByTime = new Map([
    ["1", ["group2"]],
    ["2", ["group3"]],
    ["3", ["group1"]],
    ["4", ["group1", "group2"]],
    ["5", ["group2", "group3"]],
    ["6", ["group1", "group3"]],
    ["7", ["group1", "group2"]],
    ["8", ["group2", "group3"]],
    ["9", ["group3"]],
    ["10", ["group1"]],
    ["11", ["group2"]],
    ["12", ["group1", "group3"]],
]);
var CronJob = require('cron').CronJob;
function formattedMessage(systime) {
    var returnTime = systime.toLocaleTimeString('en-US'); //make sure time is in consistent format
    //get substring from start until the first ':' character.
    //in US locale that will be the hours
    var returnHour = returnTime.substring(0, returnTime.indexOf(":"));
    console.log("what's the hour?: " + returnHour);
    if (groupByTime.has(returnHour)) {
        var messageString_1 = "Naruni-powered merchant search!\n";
        messageString_1 += "Merchants online!\n"; //<@&role_id>
        console.log("what's the groups?: " + groupByTime.get(returnHour));
        var groupArray = groupByTime.get(returnHour);
        groupArray.forEach(function (value) {
            if (value === "group1") {
                messageString_1 += "<@&" + roleGroup1 + "> Merchants: \n"
                    + "**[Ben (Rethramis)]**:\n"
                    + "> Loghill - Loghill Outpost\n> Ankumo Mountain - Border Watch\n> Rethramis Border - Regria Monastary\n"
                    + "**[Peter (North Vern)]**:\n"
                    + "> Port Krona - Downtown Port Krona\n> Parna Forest - Parna's Sanctum\n> Fesnar Highland - Barrier Trail\n> Vernese Forest - Ranger HQ\n> Balankar Mountains - Lighthouse Village\n"
                    + "**[Laitir (Yorn)]**:\n"
                    + "> Yorn's Cradle - Glory Trade Plaza\n> Unfinished Garden - Youthful Garden\n> Black Anvil Mine - Sleepy Shelter\n> Iron Hammer Mine - Radiant Gold Mine\n> Hall of Promise - Library Obscure\n"
                    + "\n";
            }
            else if (value === "group2") {
                messageString_1 += "<@&" + roleGroup2 + "> Merchants: \n"
                    + "**[Lucas (Yudia)]**:\n"
                    + "> Ozhorn Hill - Ozhorn Assembly Area\n> Saland Hill- Salt Works\n"
                    + "**[Morris (East Luterra)]**:\n"
                    + "> Dyorika Plains - Bishu Manor\n> Sunbright Hill - Pumpkin Farm\n> Flowering Orchard - Deier Village\n"
                    + "**[Mac (Anikka)]**:\n"
                    + "> Delphi Township - Market District\n> Rattan Hill - Cold Haunted House\n> Melody Forest - Ascetic Temple\n> Prisma Valley - Beacon Point\n> Twilight Mist - Cloud Valley\n"
                    + "**[Jeffrey (Shushire)]**:\n"
                    + "> Icewing Cliff - Gray Wolves\n> Lake Eternity - Lakeside Fishing Spot\n> Frozen Sea - Shadow Market\n> Iceblood Plateau - Graymoon Camp\n> Bitterwind Hill - Bitterwind Hill Post\n"
                    + "**[Dorella (Feiton)]**:\n"
                    + "> Kalaja Village - Portal Statue\n"
                    + "\n";
            }
            else if (value === "group3") {
                messageString_1 += "<@&" + roleGroup3 + "> Merchants: \n"
                    + "**[Malone (West Luterra)]**:\n"
                    + "> Battlebound Plains - Front Outpost\n> Bilbrin Forest - Spring Refugee Outpost\n> Medrick Monastary - Medrick Monastary\n> Lakebar- Lakebar Village\n> Mount Zagoras - Zagoras Fortress\n"
                    + "**[Burt (East Luterra)]**:\n"
                    + "> Blackrose Chapel - Styxia Village\n> Borea's Domain - Borea Castle\n> Croconys Seashore - Croconys Fishing Village\n> Leyar Terrace - Tamir Village\n"
                    + "**[Oliver (Tortoyk)]**:\n"
                    + "> Seaswept Woods - Cashew Forest\n> Skyreach Steppe - Thumb Shores\n> Sweetwater Forest - Sweetwater Farm\n> Forest of Giants - Tortoyk's Arm\n"
                    + "**[Nox (Arthetine)]**:\n"
                    + "> Riza Falls - Verdantier Observatory\n> Totrich - Clockwork Square\n> Arid Path - Lupen Port\n> Scraplands - Relay Guard Post\n> Nebelhorn - Nebelhorn Lab\n> Windbringer Hills - Guard Post\n"
                    + "**[Aricer (Rohendel)]**:\n"
                    + "> Lake Shiverwave - Fairy Settlement\n> Xeneela Ruins - Contaminated Village\n> Breezesome Brae - Dandelion Hill\n> Glass Lotus Lake - Foehn Plains\n> Elzowin's Shade - West Knurlroot Forest\n"
                    + "**[Rayni (Punika)]**:\n"
                    + "> Tika Tika Colony - Militia Residence\n> Tideshelf Path - Mellow Beach\n> Secret Forest - Forlorn Swamps\n> Starsand Beach - Starlight Shelter\n"
                    + "\n";
            }
            //function fetchMerchantFromGroup: string = ""; //for now just group
            //if group blah print this if group blah print that
        });
        return messageString_1;
    }
    else {
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
var botChannelId = process.env.BOTCHANNEL_ID;
var messageChannel = null;
var job = new CronJob('0 30 * * * *', function () {
    messageChannel = client.channels.cache.get(botChannelId);
    messageChannel.send(formattedMessage(new Date()));
}, null, true);
job.start();
client.on('messageReactionAdd', function (reaction, user) {
    var authorName = reaction.message.author.username;
    if (authorName === "Moving Mokoko") {
        if (reaction.emoji.name === "1️⃣") {
            reaction.message.guild.members.cache.get(user.id).roles.add(roleGroup1);
        }
        else if (reaction.emoji.name === "2️⃣") {
            reaction.message.guild.members.cache.get(user.id).roles.add(roleGroup2);
        }
        else if (reaction.emoji.name === "3️⃣") {
            reaction.message.guild.members.cache.get(user.id).roles.add(roleGroup3);
        }
    }
});
//this will trigger on every message, how to make it on specific message?
client.on('messageReactionRemove', function (reaction, user) {
    var authorName = reaction.message.author.username;
    if (authorName === "Moving Mokoko") {
        if (reaction.emoji.name === "1️⃣")
            reaction.message.guild.members.cache.get(user.id).roles.remove(roleGroup1);
        else if (reaction.emoji.name === "2️⃣")
            reaction.message.guild.members.cache.get(user.id).roles.remove(roleGroup2);
        else if (reaction.emoji.name === "3️⃣")
            reaction.message.guild.members.cache.get(user.id).roles.remove(roleGroup3);
    }
    //does this mean anyone with username Moving Mokoko can trigger?
});
var introductionChannelId = process.env.INTRODUCTION_CHANNEL_ID;
// client.on('ready', () => {
//     let introductionMessage: string = "Hello, I'm a moving mokoko. Traveling merchants are divided into 3 groups.\n\n"
//     + "**Group 1**: Ben (Rethramis) | Peter (North Vern) | Laitir (Yorn)\n"
//     + "**Group 2**: Lucas (Yudia) | Morris (East Luterra) | Mac (Anikka) | Jeffery (Shushire) | Dorella (Feiton)\n"
//     + "**Group 3**: Malone (West Luterra) | Burt (East Luterra) | Oliver (Tortoyk) | Nox (Arthetine) | Aricer (Rohendel) | Rayni (Punika)\n\n"
//     + "If you are searching for the Seria card (Lostwind Cliff set), only Burt (group 3) has a chance of selling it.\n\n"
//     + "React with :one: / :two: / :three: below and I will ping you when it is time for the respective group to spawn!";
//     console.log("ready to go")
//     messageChannel = client.channels.cache.get(introductionChannelId) as Discord.TextChannel;
//     messageChannel.send(introductionMessage);
// });
client.on('messageCreate', function (msg) {
    if (msg.content === 'mokoko') {
        msg.reply('Mokoko my nuts\ngottemmm :relieved:');
    }
});
// Cron: every time minute is 30, look at hour and all 3 groups
// find the groups that have the time and add group numbers to bitmask << probably unnecessary for only 3 rotations
// just add group numbers to array
// go to JSON and pull information of merchants in corresponding groups
// print
client.login(token).then(function () {
    console.log("login successful");
}); //login bot using token
