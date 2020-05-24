import React from 'react';
import { Ellipse } from 'react-native-svg';

import Shape from '../../../types/Shape';

const EllipseShape = ({
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
    <Ellipse
      cx={x + 50}
      cy={y + 50}
      rx={50}
      ry={50}
      fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
      opacity={opacity}
      {...props}
    />
  );
};

export default EllipseShape;
