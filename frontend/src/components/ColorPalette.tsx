import { styled } from '@mui/material';
import { RGBValue } from './ViewObject';

interface ColorPaletteProps {
    rgbArray: RGBValue[];
}

export interface HSLValue {
    h: number;
    s: number;
    l: number;
}

const ColorPalette = ({ rgbArray }: ColorPaletteProps) => {
    // credit https://github.com/zygisS22/color-palette-extraction
    const MAX_DEPTH = 4;
    const QUANTIZATION_DEFAULT_DEPTH = 1;

    //  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
    const rgbToHex = (pixel: RGBValue): string => {
        const componentToHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return (
            '#' +
            componentToHex(pixel.r) +
            componentToHex(pixel.g) +
            componentToHex(pixel.b)
        ).toUpperCase();
    };

    // returns what color channel has the biggest difference
    const findBiggestColorRange = (rgbValues: RGBValue[]) => {
        /**
         * Min is initialized to the maximum value posible
         * from there we procced to find the minimum value for that color channel
         *
         * Max is initialized to the minimum value posible
         * from there we procced to fin the maximum value for that color channel
         */
        let rMin = Number.MAX_VALUE;
        let gMin = Number.MAX_VALUE;
        let bMin = Number.MAX_VALUE;

        let rMax = Number.MIN_VALUE;
        let gMax = Number.MIN_VALUE;
        let bMax = Number.MIN_VALUE;

        rgbValues.forEach((pixel) => {
            rMin = Math.min(rMin, pixel.r);
            gMin = Math.min(gMin, pixel.g);
            bMin = Math.min(bMin, pixel.b);

            rMax = Math.max(rMax, pixel.r);
            gMax = Math.max(gMax, pixel.g);
            bMax = Math.max(bMax, pixel.b);
        });

        const rRange = rMax - rMin;
        const gRange = gMax - gMin;
        const bRange = bMax - bMin;

        // determine which color has the biggest difference
        const biggestRange = Math.max(rRange, gRange, bRange);
        if (biggestRange === rRange) {
            return 'r';
        } else if (biggestRange === gRange) {
            return 'g';
        } else {
            return 'b';
        }
    };

    const quantization = (rgbValues: RGBValue[], depth: number): RGBValue[] => {
        // Base case
        if (depth === MAX_DEPTH || rgbValues.length === 0) {
            const color = rgbValues.reduce(
                (prev, curr) => {
                    prev.r += curr.r;
                    prev.g += curr.g;
                    prev.b += curr.b;

                    return prev;
                },
                {
                    r: 0,
                    g: 0,
                    b: 0,
                }
            );

            color.r = Math.round(color.r / rgbValues.length);
            color.g = Math.round(color.g / rgbValues.length);
            color.b = Math.round(color.b / rgbValues.length);

            return [color];
        }

        /**
         *  Recursively do the following:
         *  1. Find the pixel channel (red,green or blue) with biggest difference/range
         *  2. Order by this channel
         *  3. Divide in half the rgb colors list
         *  4. Repeat process again, until desired depth or base case
         */
        const componentToSortBy = findBiggestColorRange(rgbValues);
        rgbValues.sort((p1, p2) => {
            return p1[componentToSortBy] - p2[componentToSortBy];
        });

        const mid = rgbValues.length / 2;
        return [
            ...quantization(rgbValues.slice(0, mid), depth + 1),
            ...quantization(rgbValues.slice(mid + 1), depth + 1),
        ];
    };

    const orderByLuminance = (rgbValues: RGBValue[]): RGBValue[] => {
        const calculateLuminance = (rgbValue: RGBValue) => {
            return (
                0.2126 * rgbValue.r + 0.7152 * rgbValue.g + 0.0722 * rgbValue.b
            );
        };

        return rgbValues.sort((rgbValue1, rgbValue2) => {
            return (
                calculateLuminance(rgbValue2) - calculateLuminance(rgbValue1)
            );
        });
    };

    /**
     * Color quantization
     * A process that reduces the number of colors used in an image
     * while trying to visually maintin the original image as much as possible
     */
    const quantColors = quantization(rgbArray, QUANTIZATION_DEFAULT_DEPTH);

    const orderedByLuminance = orderByLuminance(quantColors);

    const hexValues = orderedByLuminance.map((rgbElement) =>
        rgbToHex(rgbElement)
    );
    //////////////////////////////////////////////////////////////////////
    return (
        <Wrapper>
            {hexValues.map((hexValue, i) => (
                <ColorSquare
                    key={`item-${Date.now()}-${i}`}
                    hexValue={hexValue}
                />
            ))}
        </Wrapper>
    );
};

const Wrapper = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    marginBottom: '2rem',
}));

const ColorSquare = styled('div')(({ hexValue }: { hexValue: string }) => ({
    backgroundColor: hexValue,
    height: '2rem',
    width: '2rem',
}));

export default ColorPalette;
