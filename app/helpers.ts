function convertToNumber(input: string|undefined, type: string) {
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

function shouldThrow(parsedInput: number|undefined) {
    if (!parsedInput || isNaN(parsedInput)) {
        throw new Error('Not a number');
    } else {
        return parsedInput;
    }
}

export function convertToInt(input: string|undefined) {
    return convertToNumber(input, 'int');
}

export function convertToIntOrThrow(input: string|undefined) {
    const parsedInput = convertToNumber(input, 'int');

    return shouldThrow(parsedInput);
}

export function convertToFloat(input: string) {
    return convertToNumber(input, 'float');
}

export function convertToFloatOrThrow(input: string) {
    const parsedInput = convertToNumber(input, 'float');

    return shouldThrow(parsedInput);
}

export function convertToArray(input: any) {
    if (Array.isArray(input)) {
        return input;
    }

    return [input];
}

export function isUrl(input: string) {
    if (typeof input !== 'string') {
        return undefined;
    }

    const pattern = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    return pattern.test(input.trim());
}
