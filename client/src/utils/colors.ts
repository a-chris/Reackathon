import * as _ from 'lodash';

const colors = {
    white: '#ffffff',
    gray: '#e2e8f0',
    gray_light: '#F5F5F5',
    black: '#000000',
    black_almost: '#090909',
    orange: '#ea6619',
    orange_dark: '#e66c4f',
    orange_light: '#d97427',
    yellow: '#e6aa46',
    red_dark: '#bd4f38',
    red_light: '#e6504f',
    green: '#319795',
};

export default colors;

const exclude = new Set(['white', 'gray', 'gray_light', 'black', 'black_almost']);
const colorsToExtract = Object.entries(colors)
    .filter((e) => !exclude.has(e[0]))
    .map((e) => e[1]);

export function getRandomColorHex() {
    return colorsToExtract[_.random(0, colorsToExtract.length - 1)];
}

const colorStrings = [
    'red.600',
    'orange.200',
    'orange.700',
    'green.400',
    'teal.100',
    'blue.300',
    'blue.700',
    'purple.400',
];

export function getRandomColorString() {
    return colorStrings[_.random(0, colorStrings.length - 1)];
}

export function getRandomVariantColorString() {
    return getRandomColorString()?.split('.')[0];
}
