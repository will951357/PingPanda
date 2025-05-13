"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordClient = void 0;
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
class DiscordClient {
    constructor(token) {
        this.rest = new rest_1.REST({ version: '10' }).setToken(token || process.env.DISCORD_TOKEN || '');
    }
    async createDM(userId) {
        return this.rest.post(v10_1.Routes.userChannels(), {
            body: {
                recipient_id: userId,
            }
        });
    }
    async sendEmbed(channelId, embed) {
        return this.rest.post(v10_1.Routes.channelMessages(channelId), {
            body: {
                embeds: [embed],
            }
        });
    }
}
exports.DiscordClient = DiscordClient;
