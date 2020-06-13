/* eslint @typescript-eslint/no-unused-vars: "off" */

import React from 'react';
import { Ellipse, Text } from 'react-native-svg';

import Shape from '../../../types/Shape';

const textProps = {
  style: {
    fontSize: 48,
    cursor: 'default',
  }
};

const TextShape = ({
  shapeId,
  properties: {
    position: {
      x,
      y,
    },
    fill: {
      hue,
      saturation,
      lightness,
    },
    opacity,
  },
  ...props
}) => {
  return (
    <Text
      x={x}
      y={y + 35}
      fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
      opacity={opacity}
      {...textProps}
      {...props}
    >
      Hello, World.
    </Text>
  );
};

export default TextShape;
