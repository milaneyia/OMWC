import config from '../config.json';
import Axios from 'axios';

interface DiscordWebhookMessage {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    author?: {
        name: string;
        icon_url?: string;
        url: string;
    };
    fields?: {
        name: string;
        value: string;
    }[];
    thumbnail?: {
        url: string;
    };
}

export async function webhookPost(message: DiscordWebhookMessage[]): Promise<void> {
    const url = `https://discordapp.com/api/webhooks/${config.discord.id}/${config.discord.token}`;

    try {
        await Axios.post(url, {
            embeds: message,
        });
    } catch (error) {
        console.log(error);
    }
}
