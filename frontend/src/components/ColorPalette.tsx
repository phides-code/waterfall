import { styled } from '@mui/material';
import { useState } from 'react';

interface ColorPaletteProps {
    palette: string[];
}

const ColorPalette = ({ palette }: ColorPaletteProps) => {
    const [paletteExpand, setPaletteExpand] = useState<boolean>(false);

    return (
        <Wrapper
            paletteExpand={paletteExpand}
            onClick={() => {
                setPaletteExpand((paletteExpand) => !paletteExpand);
            }}
        >
            {palette?.map((hexValue, i) => (
                <ColorSquare
                    key={`item-${Date.now()}-${i}`}
                    hexValue={hexValue}
                />
            ))}
        </Wrapper>
    );
};

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

const ColorSquare = styled('div')(({ hexValue }: { hexValue: string }) => ({
    backgroundColor: hexValue,
    height: '2rem',
    width: '2rem',
}));

export default ColorPalette;
