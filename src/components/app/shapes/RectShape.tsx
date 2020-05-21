import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View } from 'react-native-web';
import { G, Ellipse, Rect, Path } from 'react-native-svg';
import JsxParser from 'react-jsx-parser';

import Shape from '../../../types/Shape';
import ShapeContext from '../../../ShapeContext';

const Handle = ({ position: { x, y }, angle, onHandleMove }) => {
  const [firstPosition, setFirstPosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });

  const handleStartShouldSetResponder = () => true;

  const handleResponderGrant = (event) => {
    console.log(event.nativeEvent.pageX);

    setFirstPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    });
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
      transform={`rotate(${angle} ${200} ${200})`}
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
  cornerRadius,
  ...props
}: Shape['properties'] & { shapeId: number, selected: boolean; }) => {
  const [handlePosition, setHandlePosition] = useState({ x, y });
  const { currentTool, onShapeUpdate } = useContext(ShapeContext);
  // const firstCornerRadius = useRef(cornerRadius);

  const handleHandleMove = useCallback((position) => {
    const [_, handleY] = rotate(0, 0, position.x, position.y, angle);

    const newCornerRadius = handleY;

    onShapeUpdate(shapeId, {
      cornerRadius: Math.max(Math.min(newCornerRadius, halfHeight), 0),
    });
  }, [cornerRadius]);

  useEffect(() => {
    setHandlePosition({
      x,
      y,
    });
  }, [x, y, setHandlePosition]);

  const width = 200, height = 200;
  const halfWidth = width / 2, halfHeight = height / 2;

  const position = {
    x: x + halfWidth,
    y: height - (y - cornerRadius),
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
        <Handle position={position} angle={angle} onHandleMove={handleHandleMove} />
      )}
    </>
  );

  // return (
  //   <>
  //     <Rect
  //       x={x - halfWidth}
  //       y={y - halfHeight}
  //       width={width}
  //       height={height}
  //       transform={`rotate(${angle} ${x} ${y})`}
  //       fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
  //       opacity={opacity}
  //       {...props}
  //     />
  //     {selected && (
  //       <Handle position={position} angle={angle} onHandleMove={handleHandleMove} />
  //     )}
  //   </>
  // );
};

export default RectShape;
