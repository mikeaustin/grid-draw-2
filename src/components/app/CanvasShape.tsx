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

const CanvasShape = React.memo((props: CanvasShapeProps) => {
  // console.log('CanvasShape()', props.shape.id);

  const self = useSelf(props);

  const [firstPosition, setFirstPosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });
  const { onShapeUpdate, onPropertyChange } = useContext(SelectedShapeContext);

  const lastTap = useRef<number>(Date.now());

  const handleStartShouldSetResponder = useCallback((event: any) => {
    event.preventDefault();

    const tap = !(Date.now() - lastTap.current < 300);
    lastTap.current = Date.now();

    return tap;
  }, []);

  const handleResponderGrant = useCallback(event => {
    setFirstPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    });

    if (!self.selected) {
      self.onSelectShape(self.shape.id);
    }
  }, [self]);

  const handleResponderMove = useCallback(event => {
    onShapeUpdate(self.shape.id, {
      position: {
        x: self.shape.properties.position.x + event.nativeEvent.pageX - firstPosition.x,
        y: self.shape.properties.position.y + event.nativeEvent.pageY - firstPosition.y,
      }
    });
  }, [self, firstPosition, onShapeUpdate]);

  const handleResponseRelease = useCallback(event => {
    if (event.nativeEvent.pageX - firstPosition.x === 0 && event.nativeEvent.pageY - firstPosition.y === 0) {
      return;
    }

    let newPosition = {
      x: self.shape.properties.position.x + (event.nativeEvent.pageX - firstPosition.x),
      y: self.shape.properties.position.y + (event.nativeEvent.pageY - firstPosition.y),
    };

    onPropertyChange(self.shape.id, 'position', newPosition);
  }, [self, firstPosition, onPropertyChange]);

  const shapeEventProps = {
    onStartShouldSetResponder: handleStartShouldSetResponder,
    onStartShouldSetResponderCapture: handleStartShouldSetResponder,
    onResponderGrant: handleResponderGrant,
    onResponderMove: handleResponderMove,
    onResponderRelease: handleResponseRelease,
  };

  const Component = shapeRegistry[self.shape.type].render;

  return (
    <CanvasShapeShape
      Component={Component}
      shape={props.shape}
      selected={props.selected}
      {...shapeEventProps}
    >
      <CanvasShapeList
        allShapes={props.allShapes}
        childIds={props.shape.childIds}
        selectedShapeIds={props.selectedShapeIds}
        onSelectShape={props.onSelectShape}
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

const CanvasShapeList = React.memo(({ allShapes, childIds, selectedShapeIds, onSelectShape }: CanvasShapeListProps) => {
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

// const CanvasShape = React.memo(_CanvasShape);
// const CanvasShapeList = React.memo(_CanvasShapeList);

export default CanvasShape;
