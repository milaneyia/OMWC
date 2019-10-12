import axios, { AxiosRequestConfig } from 'axios';
import Crypto from 'crypto';
import querystring from 'querystring';
import config from '../../config.json';

export function generateState() {
    return Crypto.randomBytes(48).toString('hex');
}

export function generateAuthorizeUrl(rawState: string) {
    const hashedState = Buffer.from(rawState).toString('base64');

    return 'https://osu.ppy.sh/oauth/authorize?response_type=code' +
        '&client_id=' + config.osuv2.id +
        '&redirect_uri=' + encodeURIComponent(config.osuv2.redirect) +
        '&state=' + hashedState +
        '&scope=identify';
}

export function decodeState(hashedState: string) {
    return Buffer.from(hashedState, 'base64').toString('ascii');
}

export async function getToken(code: string) {
    const data = querystring.stringify({
        client_id: config.osuv2.id,
        client_secret: config.osuv2.secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.osuv2.redirect,
    });

    const options: AxiosRequestConfig = {
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'post',
        url: 'https://osu.ppy.sh/oauth/token',
    };

    try {
        const res = await axios(options);
        return res.data;
    } catch (error) {
        return { error };
    }
}

export async function refreshToken(token: string) {
    const data = querystring.stringify({
        client_id: config.osuv2.id,
        client_secret: config.osuv2.secret,
        grant_type: 'refresh_token',
        refresh_token: token,
    });

    const options: AxiosRequestConfig = {
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://osu.ppy.sh/oauth/token',
    };

    try {
        const res = await axios(options);
        return res.data;
    } catch (error) {
        return { error };
    }
}

export async function getUserInfo(token: string) {
    const options: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: 'GET',
        url: 'https://osu.ppy.sh/api/v2/me',
    };

    try {
        const res = await axios(options);
        return res.data;
    } catch (error) {
        return { error };
    }
}
