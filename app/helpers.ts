import fs from 'fs';

export function convertToIntOrThrow(input: string): number {
    const parsedInput = parseInt(input, 10);

    if (isNaN(parsedInput)) {
        throw new Error('Not a number');
    }

    return parsedInput;
}

export function convertToArray<T>(input: T): T[] {
    if (Array.isArray(input)) {
        return input;
    }

    return [input];
}

export function isUrl(input: string): boolean {
    if (typeof input !== 'string') {
        return false;
    }

    const pattern = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

    return pattern.test(input.trim());
}

export function isOsuUrl(input: string): boolean {
    if (!isUrl(input)) {
        return false;
    }

    const url = new URL(input);

    return url.host === 'osu.ppy.sh';
}

export async function checkFileExistence(path: string): Promise<void> {
    await fs.promises.access(path, fs.constants.F_OK | fs.constants.R_OK);
}

export async function saveFile(inputPath: string, outputDir: string, outputPath: string): Promise<void> {
    try {
        await fs.promises.mkdir(outputDir, { recursive: true });
        await fs.promises.copyFile(inputPath, outputPath);
    } catch (error) {
        console.log(error);
        throw new Error(`Couldn't save the file`);
    }
}
