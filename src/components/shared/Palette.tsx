/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useContext, useCallback, useRef, useMemo, useEffect } from 'react';
import { Svg, Rect } from 'react-native-svg';

import { AppContext, SelectedShapeContext } from '../../AppContext';

const range = (from, to) => ({
  map(f) {
    return Array.from({ length: to - from + 1 }, (_, index) => f(index + from));
  }
});

const size = 15;

const _Colors = ({ height, onColorChange }) => {
  const handlePressIn = useCallback(event => {
    const color = event.target.getAttribute('fill').match(/hsl\(([\d.]+), ([\d.]+)%, ([\d.]+)%\)/);

    onColorChange({
      hue: Number(color[1]),
      saturation: Number(color[2]),
      lightness: Number(color[3]),
    });
  }, [onColorChange]);

  const eventProps = useMemo(() => ({
    onPressIn: handlePressIn,
  }), [handlePressIn]);

  return (
    <Svg height={height} {...eventProps}>
      {range(0, 35).map((hue: number) => (
        range(0, 8).map((color: number) => (
          <Rect
            key={hue * 35 + color}
            x={hue * size + size * 2}
            y={color * size}
            width={size}
            height={size}
            fill={`hsl(${hue * 10}, ${100}%, ${100 - (color * 7.5 + 20)}%)`}

          />
        ))
      ))}
      {range(0, 8).map((color: number) => (
        <Rect
          key={color}
          x={size * 1}
          y={color * size}
          width={size}
          height={size}
          fill={`hsl(${0}, ${0}%, ${100 - (color * 7.5 + 20)}%)`}
        />
      ))}
      <Rect
        key={'white'}
        x={0}
        y={0}
        width={size}
        height={size * 4.5}
        fill={`hsl(${0}, ${0}%, ${100}%)`}
      />
      <Rect
        key={'black'}
        x={0}
        y={size * 4.5}
        width={size}
        height={size * 4.5}
        fill={`hsl(${0}, ${0}%, ${0}%)`}
      />
    </Svg>
  );
};

const Palette = (props) => {
  const { onPropertyChange } = useContext(SelectedShapeContext);

  const handleColorChange = useCallback(color => {
    onPropertyChange(undefined, 'fill', color);
  }, [onPropertyChange]);

  return (
    <Colors height={size * 9} onColorChange={handleColorChange} />
  );
};

const Colors = React.memo(_Colors);

export default React.memo(Palette);
