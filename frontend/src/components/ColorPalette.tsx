import { styled } from '@mui/material';
import { useState } from 'react';
import { contrastColor } from 'contrast-color';

interface ColorPaletteProps {
    palette: string[];
}

const ColorPalette = ({ palette }: ColorPaletteProps) => {
    const [paletteExpand, setPaletteExpand] = useState<boolean>(false);

    return (
        <Wrapper
            paletteExpand={paletteExpand}
            onClick={() => {
                if (!paletteExpand) {
                    setPaletteExpand(true);
                }
            }}
        >
            {palette?.map((hexValue, i) => {
                const textColor = contrastColor({ bgColor: hexValue });
                return (
                    <ColorSquareWrapper key={`item-${Date.now()}-${i}`}>
                        <ColorSquare
                            hexValue={hexValue}
                            paletteExpand={paletteExpand}
                        >
                            {paletteExpand && (
                                <HexCode color={textColor}>{hexValue}</HexCode>
                            )}
                        </ColorSquare>
                    </ColorSquareWrapper>
                );
            })}
        </Wrapper>
    );
};

const ColorSquareWrapper = styled('div')(() => ({
    display: 'flex',
}));

const Wrapper = styled('div')(
    ({ paletteExpand }: { paletteExpand: boolean }) => ({
        display: 'flex',
        flexDirection: paletteExpand ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1rem',
        marginBottom: '1rem',
    })
);

const ColorSquare = styled('div')(
    ({
        hexValue,
        paletteExpand,
    }: {
        hexValue: string;
        paletteExpand: boolean;
    }) => ({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: hexValue,
        height: '2rem',
        width: paletteExpand ? '8rem' : '2rem',
    })
);

const HexCode = styled('span')(({ color }: { color: string }) => ({
    color: color,
}));

export default ColorPalette;
