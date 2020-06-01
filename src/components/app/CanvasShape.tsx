/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useState, useRef, useContext, useMemo, useEffect, useCallback } from 'react';

import shapeRegistry from './ShapeRegistry';
import { AppContext, SelectedShapeContext } from '../../AppContext';
import { State, Shape, Properties } from '../../types';
import { useEvent, useSelf } from '../../utilities/hooks';
import CanvasShapeShape from './CanvasShapeShape';

type CanvasShapeProps = {
  shape: Shape,
  selected: boolean,
  allShapes: State['allShapes'],
  selectedShapeIds: number[],
  onSelectShape: (shapeId: number) => void,
};

const CanvasShape = React.memo(({
  shape,
  selected,
  allShapes,
  selectedShapeIds,
  onSelectShape,
}: CanvasShapeProps) => {
  // console.log('CanvasShape()', props.shape.id);

  const [firstPosition, setFirstPosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });
  const { onShapeUpdate, onPropertyChange } = useContext(SelectedShapeContext);

  const lastTap = useRef<number>(Date.now());

  const handleStartShouldSetResponder = useCallback((event: any) => {
    event.preventDefault();

    const tap = !(Date.now() - lastTap.current < 300);
    lastTap.current = Date.now();

    return tap;
  }, []);

  const handleResponderGrant = useEvent((event, [shapeId, selected, onShapeUpdate]) => {
    setFirstPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    });

    if (!selected) {
      onSelectShape(shapeId);
    }
  }, [shape.id, selected, onShapeUpdate]);

  const handleResponderMove = useEvent((event, [shapeId, position, firstPosition, onShapeUpdate]) => {
    onShapeUpdate(shapeId, {
      position: {
        x: position.x + event.nativeEvent.pageX - firstPosition.x,
        y: position.y + event.nativeEvent.pageY - firstPosition.y,
      }
    });
  }, [shape.id, shape.properties.position, firstPosition, onShapeUpdate]);

  const handleResponseRelease = useEvent((event, [shapeId, position, firstPosition, onPropertyChange]) => {
    if (event.nativeEvent.pageX - firstPosition.x === 0 && event.nativeEvent.pageY - firstPosition.y === 0) {
      return;
    }

    let newPosition = {
      x: position.x + (event.nativeEvent.pageX - firstPosition.x),
      y: position.y + (event.nativeEvent.pageY - firstPosition.y),
    };

    onPropertyChange(shapeId, 'position', newPosition);
  }, [shape.id, shape.properties.position, firstPosition, onPropertyChange]);

  const shapeEventProps = {
    onStartShouldSetResponder: handleStartShouldSetResponder,
    onStartShouldSetResponderCapture: handleStartShouldSetResponder,
    onResponderGrant: handleResponderGrant,
    onResponderMove: handleResponderMove,
    onResponderRelease: handleResponseRelease,
  };

  const Component = shapeRegistry[shape.type].render;

  return (
    <CanvasShapeShape
      Component={Component}
      shape={shape}
      selected={selected}
      {...shapeEventProps}
    >
      <CanvasShapeList
        allShapes={allShapes}
        childIds={shape.childIds}
        selectedShapeIds={selectedShapeIds}
        onSelectShape={onSelectShape}
      />
    </CanvasShapeShape>
  );
});

type CanvasShapeListProps = {
  allShapes: State['allShapes'],
  childIds: number[],
  selectedShapeIds: number[],
  onSelectShape: (shapeId: number) => void,
};

const CanvasShapeList = React.memo(({
  allShapes,
  childIds,
  selectedShapeIds,
  onSelectShape
}: CanvasShapeListProps) => {
  return (
    <>
      {childIds.map(childId => {
        // console.log('shape.childIds.map()', childId);

        const shape = allShapes[childId];
        const selected = selectedShapeIds.includes(childId);

        return (
          <CanvasShape
            key={childId}
            shape={shape}
            selected={selected}
            allShapes={allShapes}
            selectedShapeIds={selectedShapeIds}
            onSelectShape={onSelectShape}
          />
        );
      })}
    </>
  );
});

export default CanvasShape;
