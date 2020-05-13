import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';

import shapeRegistry from './ShapeRegistry';
import ShapeContext from '../../ShapeContext';

type CanvasShapeProps = {
  shape: any,
  selected: boolean,
  allShapes: any,
  selectedShapeIds: number[],
  onSetPosition: Function,
  onSelectShape: Function,
  onShapeUpdate: Function,
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
  console.log('CanvasShape()', shape.id);

  const [firstPosition, setFirstPosition] = useState<number[]>([0, 0]);
  const [selectedShape, setSelectedShape] = useState<any | null>(null);
  const { eventEmitter } = useContext(ShapeContext);

  const lastTap = useRef<number>(Date.now());

  useEffect(() => {
    if (selected) {
      eventEmitter.addListener('position', handlePositionChange);
      eventEmitter.addListener('opacity', handlePositionChange);
    } else {
      setSelectedShape(null);
      eventEmitter.removeListener('position', handlePositionChange);
      eventEmitter.removeListener('opacity', handlePositionChange);
    }
  }, [eventEmitter, selected]);

  const handlePositionChange = useCallback(shape => {
    setSelectedShape(shape);
  }, []);

  const handleStartShouldSetResponder = useCallback(event => {
    event.preventDefault();

    const tap = !(Date.now() - lastTap.current < 300);
    lastTap.current = Date.now();

    return tap;
  }, []);

  const handleResponderGrant = useCallback((event: any) => {
    setFirstPosition([event.nativeEvent.pageX, event.nativeEvent.pageY]);
    onSelectShape(shape.id);

    setTimeout(() => {
      onShapeUpdate(shape.id, {
        position: shape.position,
        opacity: shape.opacity,
      });
    }, 0);
  }, [shape.id, setFirstPosition, onShapeUpdate]);

  const handleResponderMove = useCallback(event => {
    onShapeUpdate(shape.id, {
      position: [
        shape.position[0] + event.nativeEvent.pageX - firstPosition[0],
        shape.position[1] + event.nativeEvent.pageY - firstPosition[1],
      ]
    });
  }, [shape.id, firstPosition, onShapeUpdate]);

  const handleResponseRelease = useCallback(event => {
    console.log('----------');

    onSetPosition(shape.id, [
      shape.position[0] + (event.nativeEvent.pageX - firstPosition[0]),
      shape.position[1] + (event.nativeEvent.pageY - firstPosition[1]),
    ]);
  }, [onSetPosition]);

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
      {...(selectedShape ? selectedShape : shape)}
      stroke={selected ? 'hsl(210, 90%, 55%)' : undefined}
      strokeWidth={selected ? 5 : undefined}
      {...shapeProps}
    >
      {shape.childIds.map(childId => {
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
