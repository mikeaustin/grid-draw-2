/* eslint @typescript-eslint/no-unused-vars: "off" */

import React from 'react';
import { G } from 'react-native-svg';

import Shape from '../../../types/Shape';

const GroupShape = ({
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
  const groupProps = {
    style: {
      pointerEvents: 'visiblePainted'
    }
  };

  return (
    <G
      x={x}
      y={y}
      opacity={opacity}
      {...groupProps}
      {...props}
    />
  );
};

export default GroupShape;
