import fs from 'fs';

function convertToNumber(input: string|undefined, type: string): number | undefined {
    let parsedInput: number|undefined;

    if (input) {
        if (type === 'int') {
            parsedInput = parseInt(input, 10);
        } else if (type === 'float') {
            parsedInput = parseFloat(input);
        }
    }

    return parsedInput;
}

function shouldThrow(parsedInput: number|undefined): number {
    if (!parsedInput || isNaN(parsedInput)) {
        throw new Error('Not a number');
    } else {
        return parsedInput;
    }
}

export function convertToInt(input: string|undefined): number | undefined {
    return convertToNumber(input, 'int');
}

export function convertToIntOrThrow(input: string|undefined): number {
    const parsedInput = convertToNumber(input, 'int');

    return shouldThrow(parsedInput);
}

export function convertToFloat(input: string): number | undefined {
    return convertToNumber(input, 'float');
}

export function convertToFloatOrThrow(input: string): number {
    const parsedInput = convertToNumber(input, 'float');

    return shouldThrow(parsedInput);
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
    await fs.promises.mkdir(outputDir, { recursive: true });

    return new Promise((resolve, reject) => {
        const reader = fs.createReadStream(inputPath);
        const stream = fs.createWriteStream(outputPath);
        reader.pipe(stream).end();
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}
