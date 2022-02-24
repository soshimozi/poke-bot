import {Client} from "discord.js";

export default (client:Client) : void => {
    client.on("ready", async () => {
        if (!client.user) {
            return;
        }
        console.log(`${client.user.username} is online`);
    });
}
