import React, { useState, useContext, useRef, useCallback } from 'react';
import { Circle } from 'react-native-svg';

type DragHandleProps = {
  position: { x: number, y: number; },
  transform?: string,
  index?: number,
  solid?: boolean,
  onDragStart?: Function,
  onDragMove?: Function,
  onDragEnd?: Function,
};

const DragHandle = ({
  position: { x, y },
  transform,
  index,
  solid,
  onDragStart,
  onDragMove,
  onDragEnd,
}: DragHandleProps) => {
  const [firstPosition, setFirstPosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });

  const handleStartShouldSetResponder = () => true;

  const handleResponderGrant = (event) => {
    setFirstPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    });

    onDragStart && onDragStart({
      x: 0,
      y: 0
    }, index);
  };

  const handleResponderMove = (event) => {
    onDragMove && onDragMove({
      x: event.nativeEvent.pageX - firstPosition.x,
      y: event.nativeEvent.pageY - firstPosition.y,
    }, index);
  };

  const handleResponderRelease = (event) => {
    onDragEnd && onDragEnd({
      x: event.nativeEvent.pageX - firstPosition.x,
      y: event.nativeEvent.pageY - firstPosition.y,
    }, index);
  };

  const shapeProps = {
    style: { cursor: 'pointer' },
    onStartShouldSetResponder: handleStartShouldSetResponder,
    onResponderGrant: handleResponderGrant,
    onResponderMove: handleResponderMove,
    onResponderRelease: handleResponderRelease,
  };

  return (
    <Circle
      cx={x}
      cy={y}
      r={solid ? 5 : 7}
      transform={transform}
      fill={solid ? 'black' : 'white'}
      stroke={solid ? 'transparent' : 'black'}
      strokeWidth={solid ? 4 : 2}
      {...shapeProps}
    />
  );
};

export default DragHandle;
