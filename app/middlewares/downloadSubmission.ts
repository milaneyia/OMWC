/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParameterizedContext, Next } from 'koa';
import path from 'path';
import fs from 'fs';
import { convertToIntOrThrow, checkFileExistence } from '../helpers';
import { Submission } from '../models/rounds/Submission';

export async function findSubmission(ctx: ParameterizedContext, next: Next): Promise<any> {
    const id = convertToIntOrThrow(ctx.params.id);
    const submission = await Submission.findOneOrFail({ id });

    ctx.state.submission = submission;

    return await next();
}

export async function canCaptainDownload(ctx: ParameterizedContext, next: Next): Promise<any> {
    const submission: Submission = ctx.state.submission;

    if (submission.countryId !== ctx.state.user.country.id) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }

    return await next();
}

export async function download(ctx: ParameterizedContext): Promise<any> {
    const baseDir: string = ctx.state.baseDir;
    const downloadPath: string = ctx.state.downloadPath;

    await checkFileExistence(path.join(baseDir, downloadPath));

    const s = downloadPath.split('/');
    ctx.attachment(s[s.length - 1]);
    ctx.type = 'application/octet-stream';
    ctx.body = fs.createReadStream(path.join(baseDir, downloadPath));
}
