import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';

import shapeRegistry from './ShapeRegistry';
import ShapeContext from '../../ShapeContext';
import { State, Shape, Properties } from '../../types';

type CanvasShapeProps = {
  shape: Shape,
  selected: boolean,
  allShapes: State['allShapes'],
  selectedShapeIds: number[],
  onSetPosition: (shapeId: number, position: { x: number, y: number; }) => void,
  onSelectShape: (shapeId: number) => void,
  onShapeUpdate: (shapeId: number, shape: Properties) => void,
};

const CanvasShape = React.memo(({
  shape,
  selected,
  allShapes,
  selectedShapeIds,
  onSetPosition,
  onSelectShape,
  onShapeUpdate
}: CanvasShapeProps) => {
  // console.log('CanvasShape()', shape.id);

  const [firstPosition, setFirstPosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });
  const [selectedShape, setSelectedShape] = useState<any | null>(null);
  const { eventEmitter } = useContext(ShapeContext);

  const lastTap = useRef<number>(Date.now());

  useEffect(() => {
    if (selected) {
      Object.keys(shape.properties).forEach(propertyName => (
        eventEmitter.addListener(propertyName, handlePositionChange)
      ));
    } else {
      setSelectedShape(null);

      Object.keys(shape.properties).forEach(propertyName => (
        eventEmitter.removeListener(propertyName, handlePositionChange)
      ));
    }
  }, [eventEmitter, selected]);

  const handlePositionChange = useCallback((shape: Shape) => {
    setSelectedShape(shape);
  }, []);

  const handleStartShouldSetResponder = useCallback((event: any) => {
    event.preventDefault();

    const tap = !(Date.now() - lastTap.current < 300);
    lastTap.current = Date.now();

    return tap;
  }, []);

  const handleResponderGrant = useCallback((event: any) => {
    setFirstPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    onSelectShape(shape.id);

    setTimeout(() => {
      onShapeUpdate(shape.id, {
        position: shape.properties.position,
        opacity: shape.properties.opacity,
      });
    }, 0);
  }, [shape.id, setFirstPosition, onShapeUpdate]);

  const handleResponderMove = useCallback(event => {
    onShapeUpdate(shape.id, {
      position: {
        x: shape.properties.position.x + event.nativeEvent.pageX - firstPosition.x,
        y: shape.properties.position.y + event.nativeEvent.pageY - firstPosition.y,
      }
    });
  }, [shape.id, firstPosition, onShapeUpdate]);

  const handleResponseRelease = useCallback(event => {
    console.log('----------');

    let position = {
      x: shape.properties.position.x + (event.nativeEvent.pageX - firstPosition.x),
      y: shape.properties.position.y + (event.nativeEvent.pageY - firstPosition.y),
    };

    onSetPosition(shape.id, position);
  }, [firstPosition, onSetPosition]);

  const shapeProps = {
    onStartShouldSetResponder: handleStartShouldSetResponder,
    onStartShouldSetResponderCapture: handleStartShouldSetResponder,
    onResponderGrant: handleResponderGrant,
    onResponderMove: handleResponderMove,
    onResponderRelease: handleResponseRelease,
  };

  const Component = shapeRegistry[shape.type].render;

  return (
    <Component
      {...(selectedShape ? selectedShape.properties : shape.properties)}
      stroke={selected ? 'hsl(210, 90%, 55%)' : undefined}
      strokeWidth={selected ? 5 : undefined}
      {...shapeProps}
    >
      {shape.childIds.map(childId => {
        console.log('shape.childIds.map()', childId);

        const shape = allShapes[childId];
        const selected = selectedShapeIds.includes(childId);

        return (
          <CanvasShape
            key={childId}
            shape={shape}
            selected={selected}
            allShapes={allShapes}
            selectedShapeIds={selectedShapeIds}
            onSetPosition={onSetPosition}
            onSelectShape={onSelectShape}
            onShapeUpdate={onShapeUpdate}
          />
        );
      })}
    </Component>
  );
});

export default CanvasShape;
