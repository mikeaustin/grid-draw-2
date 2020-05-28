/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useContext, useCallback, useMemo } from 'react';
import { Svg, Rect } from 'react-native-svg';

import { AppContext, ShapeContext } from '../../AppContext';

const range = (from, to) => ({
  map(f) {
    return Array.from({ length: to - from + 1 }, (_, index) => f(index + from));
  }
});

const size = 15;

const _Colors = () => {
  return (
    <>
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
    </>
  );
};

const Palette = ({ selectedShapeId }) => {
  const { onPropertyChange } = useContext(ShapeContext);

  const handlePressIn = useCallback(event => {
    const color = event.target.getAttribute('fill').match(/hsl\(([\d.]+), ([\d.]+)%, ([\d.]+)%\)/);

    onPropertyChange(selectedShapeId, 'fill', {
      hue: Number(color[1]),
      saturation: Number(color[2]),
      lightness: Number(color[3]),
    });
  }, [selectedShapeId, onPropertyChange]);

  const eventProps = useMemo(() => ({
    onPressIn: handlePressIn,
  }), [handlePressIn]);

  return (
    <Svg height={size * 9} {...eventProps}>
      <Colors />
    </Svg>
  );
};

const Colors = React.memo(_Colors);

export default React.memo(Palette);
