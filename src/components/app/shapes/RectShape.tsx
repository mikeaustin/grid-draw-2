import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native-web';
import { G, Ellipse, Rect } from 'react-native-svg';
import JsxParser from 'react-jsx-parser';

import Shape from '../../../types/Shape';
import ShapeContext from '../../../ShapeContext';

const Handle = ({ position: { x, y }, angle, onHandleMove }) => {
  const [firstPosition, setFirstPosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });

  const handleStartShouldSetResponder = () => true;

  const handleResponderGrant = (event) => {
    console.log(event.nativeEvent.pageX);

    setFirstPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
  };

  const handleResponderMove = (event) => {
    console.log(event.nativeEvent.pageX);

    onHandleMove({
      x: event.nativeEvent.pageX - firstPosition.x,
      y: event.nativeEvent.pageY - firstPosition.y,
    });
  };

  const shapeProps = {
    onStartShouldSetResponder: handleStartShouldSetResponder,
    onResponderGrant: handleResponderGrant,
    onResponderMove: handleResponderMove,
    // onResponderRelease: handleResponseRelease,
  };

  return (
    <Ellipse
      cx={x}
      cy={y}
      rx={7}
      ry={7}
      transform={`rotate(${angle} ${150} ${150})`}
      fill="white"
      stroke="black"
      strokeWidth={2}
      {...shapeProps}
    />
  );
};


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
  ...props
}: Shape['properties'] & { shapeId: number, selected: boolean; }) => {
  const [handlePosition, setHandlePosition] = useState({ x, y });
  const { currentTool, onShapeUpdate } = useContext(ShapeContext);

  const handleHandleMove = (position) => {
    const [x, y] = rotate(0, 0, position.x, position.y, angle);

    const opacity = 1 - y / 100;

    onShapeUpdate(shapeId, {
      opacity: Math.max(Math.min(opacity, 1), 0),
    });
  };

  useEffect(() => {
    setHandlePosition({
      x,
      y,
    });
  }, [x, y, setHandlePosition]);

  const width = 200, height = 200;
  const halfWidth = width / 2, halfHeight = height / 2;

  const position = {
    x: x,
    y: y - opacity * halfHeight,
  };

  return (
    <>
      <Rect
        x={x - halfWidth}
        y={y - halfHeight}
        width={width}
        height={height}
        transform={`rotate(${angle} ${x} ${y})`}
        fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
        opacity={opacity}
        {...props}
      />
      {selected && (
        <Handle position={position} angle={angle} onHandleMove={handleHandleMove} />
      )}
    </>
  );
};

export default RectShape;
