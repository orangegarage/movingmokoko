import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/key.env'})
const token = process.env.CLIENT_TOKEN;

const intents = new Discord.Intents(3608);
//  * @property {IntentsResolvable} intents Intents to enable for this connection
const client = new Discord.Client({ intents });

client.login(token); //login bot using token