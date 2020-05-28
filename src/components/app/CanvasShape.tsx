/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useState, useRef, useContext, useMemo, useEffect, useCallback } from 'react';

import shapeRegistry from './ShapeRegistry';
import { AppContext, ShapeContext } from '../../AppContext';
import { State, Shape, Properties } from '../../types';

const useHOFCallback = (fn, args) => {
  const resultRef = useRef<Function>();
  const argsRef = useRef<any[]>();

  if (argsRef.current) {
    for (let i = 0; i < args.length; i++) {
      if (args[i] !== argsRef.current[i]) {
        resultRef.current = fn(...args);
        argsRef.current = args;

        break;
      }
    }
  } else {
    resultRef.current = fn(...args);
    argsRef.current = args;
  }

  return resultRef.current;

  // return useMemo(() => fn(...args), args);
};

const positionChange = setSelectedShape => (shape: Shape) => {
  setSelectedShape(shape);
};

const startShouldSetResponder = lastTap => (event: any) => {
  event.preventDefault();

  const tap = !(Date.now() - lastTap.current < 300);
  lastTap.current = Date.now();

  return tap;
};

const responderGrant = (shapeId, setFirstPosition, onSelectShape) => event => {
  setFirstPosition({
    x: event.nativeEvent.pageX,
    y: event.nativeEvent.pageY
  });

  onSelectShape(shapeId);
};

const responderMove = (shapeId, position, firstPosition, onShapeUpdate) => event => {
  onShapeUpdate(shapeId, {
    position: {
      x: position.x + event.nativeEvent.pageX - firstPosition.x,
      y: position.y + event.nativeEvent.pageY - firstPosition.y,
    }
  });
};

const responseRelease = (shapeId, position, firstPosition, onPropertyChange) => event => {
  if (event.nativeEvent.pageX - firstPosition.x === 0 && event.nativeEvent.pageY - firstPosition.y === 0) {
    return;
  }

  console.log('----------');

  let newPosition = {
    x: position.x + (event.nativeEvent.pageX - firstPosition.x),
    y: position.y + (event.nativeEvent.pageY - firstPosition.y),
  };

  onPropertyChange(shapeId, 'position', newPosition);
};

type CanvasShapeProps = {
  shape: Shape,
  selected: boolean,
  allShapes: State['allShapes'],
  selectedShapeIds: number[],
  onSelectShape: (shapeId: number) => void,
};

const _CanvasShape = ({
  shape,
  selected,
  allShapes,
  selectedShapeIds,
  onSelectShape,
}: CanvasShapeProps) => {
  // console.log('CanvasShape()', shape.id);

  const [firstPosition, setFirstPosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });
  const [selectedShape, setSelectedShape] = useState<any | null>(null);

  const { eventEmitter } = useContext(AppContext);
  const { onShapeUpdate, onPropertyChange } = useContext(ShapeContext);

  const lastTap = useRef<number>(Date.now());

  const handlePositionChange = useHOFCallback(positionChange, [
    setSelectedShape
  ]);

  const handleStartShouldSetResponder = useHOFCallback(startShouldSetResponder, [
    lastTap
  ]);

  const handleResponderGrant = useHOFCallback(responderGrant, [
    shape.id, setFirstPosition, onSelectShape
  ]);

  const handleResponderMove = useHOFCallback(responderMove,
    [shape.id, shape.properties.position, firstPosition, onShapeUpdate]
  );

  const handleResponseRelease = useHOFCallback(responseRelease, [
    shape.id, shape.properties.position, firstPosition, onPropertyChange
  ]);

  useEffect(() => {
    if (selected) {
      Object.keys(shape.properties).forEach(propertyName => {
        eventEmitter.removeListener(propertyName, handlePositionChange);
        eventEmitter.addListener(propertyName, handlePositionChange);
      });
    } else {
      setSelectedShape(null);

      Object.keys(shape.properties).forEach(propertyName => (
        eventEmitter.removeListener(propertyName, handlePositionChange)
      ));
    }
  }, [selected, shape.properties, eventEmitter, handlePositionChange]);

  const shapeEventProps = {
    onStartShouldSetResponder: handleStartShouldSetResponder,
    onStartShouldSetResponderCapture: handleStartShouldSetResponder,
    onResponderGrant: handleResponderGrant,
    onResponderMove: handleResponderMove,
    onResponderRelease: handleResponseRelease,
  };

  const Component = shapeRegistry[shape.type].render;

  return (
    <Component
      properties={selectedShape ? selectedShape.properties : shape.properties}
      stroke={selected ? 'hsl(210, 90%, 55%)' : 'black'}
      strokeWidth={selected ? 3 : 3}
      shapeId={shape.id}
      selected={selected}
      {...shapeEventProps}
    >
      <CanvasShapeList
        allShapes={allShapes}
        childIds={shape.childIds}
        selectedShapeIds={selectedShapeIds}
        onSelectShape={onSelectShape}
      />
    </Component>
  );
};

const _CanvasShapeList = ({ allShapes, childIds, selectedShapeIds, onSelectShape }) => {
  return (
    childIds.map(childId => {
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
    })
  );
};

const CanvasShape = React.memo(_CanvasShape);
const CanvasShapeList = React.memo(_CanvasShapeList);

export default CanvasShape;
