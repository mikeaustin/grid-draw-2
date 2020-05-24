import React, { useState, useContext, useRef, useCallback } from 'react';
import { Ellipse, Path } from 'react-native-svg';

import Shape from '../../../types/Shape';
import AppContext from '../../../AppContext';
import DragHandle from '../../shared/DragHandle';

function rotate(cx, cy, x, y, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
}

const RectShape = ({
  shapeId,
  selected,
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
    angle,
    cornerRadius,
  },
  ...props
}: Shape['properties'] & { shapeId: number, selected: boolean; }) => {
  const { onShapeUpdate, onPropertyChange } = useContext(AppContext);
  const firstCornerRadius = useRef(0);

  const width = 200, height = 200;
  const halfWidth = width / 2, halfHeight = height / 2;

  const handlePosition = {
    x: x + halfWidth,
    y: y + cornerRadius,
  };

  const handleDragStart = (position) => {
    firstCornerRadius.current = cornerRadius;
  };

  const handleDragMove = useCallback((position) => {
    const [_, handleY] = rotate(0, 0, position.x, position.y, angle);

    const newCornerRadius = firstCornerRadius.current + handleY;

    onShapeUpdate(shapeId, {
      cornerRadius: Math.max(Math.min(newCornerRadius, halfHeight), 0),
    });
  }, [shapeId, angle, halfHeight, onShapeUpdate]);

  const handleDragEnd = (position) => {
    const [_, handleY] = rotate(0, 0, position.x, position.y, angle);

    const newCornerRadius = firstCornerRadius.current + handleY;

    onPropertyChange(shapeId, 'cornerRadius', Math.max(Math.min(newCornerRadius, halfHeight), 0));
  };

  return (
    <>
      <Path
        d={`
        M ${x + cornerRadius + 0.5},             ${y + 0.5}
        l ${width - cornerRadius * 2},           0
        a ${cornerRadius}, ${cornerRadius} 0 0 1 ${cornerRadius}, ${cornerRadius}
        l 0,                                     ${height - cornerRadius * 2}
        a ${cornerRadius}, ${cornerRadius} 0 0 1 ${-cornerRadius}, ${cornerRadius}
        l ${-width + cornerRadius * 2},          0
        a ${cornerRadius}, ${cornerRadius} 0 0 1 ${-cornerRadius}, ${-cornerRadius}
        l 0,                                     ${-height + cornerRadius * 2}
        a ${cornerRadius}, ${cornerRadius} 0 0 1 ${cornerRadius}, ${-cornerRadius}
        z
      `}
        transform={`rotate(${angle} ${x + width / 2} ${y + height / 2})`}
        fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
        opacity={opacity}
        {...props}
      />
      {selected && (
        <DragHandle
          position={handlePosition}
          transform={`rotate(${angle} ${x + halfWidth} ${y + halfHeight})`}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      )}
    </>
  );
};

export default RectShape;
