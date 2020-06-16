/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useContext, useCallback, useRef, useMemo, useEffect } from 'react';
import { Svg, Rect } from 'react-native-svg';

import { AppContext, SelectedShapeContext } from '../../AppContext';

const range = (from, to) => ({
  map(f) {
    return Array.from({ length: to - from + 1 }, (_, index) => f(index + from));
  }
});

const hsl = (hue, saturation, lightness) => ({ hue, saturation, lightness });

const size = 15;

const ColorSwatch = ({ x, y, width, height, color, onColorSelect }) => {
  const handlePressIn = () => {
    onColorSelect(color);
  };

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={`hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`}
      onPressIn={handlePressIn}
    />
  );
};

type ColorsProps = {
  height: number,
  onColorChange: Function,
};

const Colors = React.memo(({ height, onColorChange }: ColorsProps) => {
  const handleColorSelect = color => {
    onColorChange(color);
  };

  const swatchProps = {
    width: size,
    height: size,
    onColorSelect: handleColorSelect,
  };

  return (
    <Svg height={height}>
      {range(0, 35).map((hue: number) => {
        return (
          range(0, 8).map((lightness: number) => (
            <ColorSwatch
              key={hue * 35 + lightness}
              x={hue * size + size * 2}
              y={lightness * size}
              color={hsl(hue * 10, 100, 100 - (lightness * 7.5 + 20))}
              {...swatchProps}
            />
          ))
        );
      })}
      {range(0, 8).map((lightness: number) => (
        <ColorSwatch
          key={lightness}
          x={size * 1}
          y={lightness * size}
          color={hsl(0, 0, 100 - (lightness * 7.5 + 20))}
          {...swatchProps}
        />
      ))}
      <ColorSwatch
        key={'white'}
        x={0}
        y={0}
        {...swatchProps}
        width={size}
        height={size * 4.5}
        color={hsl(0, 0, 100)}
      />
      <ColorSwatch
        key={'black'}
        x={0}
        y={size * 4.5}
        {...swatchProps}
        width={size}
        height={size * 4.5}
        color={hsl(0, 0, 0)}
      />
    </Svg>
  );
});

type PaletteProps = {};

const ColorPalette = React.memo(({ }: PaletteProps) => {
  const { onPropertyChange } = useContext(SelectedShapeContext);

  const handleColorChange = useCallback(color => {
    onPropertyChange(undefined, 'fill', color);
  }, [onPropertyChange]);

  return (
    <Colors height={size * 9} onColorChange={handleColorChange} />
  );
});

export default ColorPalette;
