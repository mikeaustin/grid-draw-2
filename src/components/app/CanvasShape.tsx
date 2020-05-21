import React, { useState, useRef, useContext, useMemo, useEffect, useCallback } from 'react';

import shapeRegistry from './ShapeRegistry';
import ShapeContext from '../../ShapeContext';
import { State, Shape, Properties } from '../../types';

const positionChange = setSelectedShape => (shape: Shape) => {
  setSelectedShape(shape);
};

const startShouldSetResponder = lastTap => (event: any) => {
  event.preventDefault();

  const tap = !(Date.now() - lastTap.current < 300);
  lastTap.current = Date.now();

  return tap;
};

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

type CanvasShapeProps = {
  shape: Shape,
  selected: boolean,
  allShapes: State['allShapes'],
  selectedShapeIds: number[],
  onSetPosition: (shapeId: number, position: { x: number, y: number; }) => void,
  onSelectShape: (shapeId: number) => void,
  onShapeUpdate: (shapeId: number, shape: Properties) => void,
};

const _CanvasShape = ({
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
  const { eventEmitter, currentTool } = useContext(ShapeContext);

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

  // const handlePositionChange = useCallback((shape: Shape) => {
  //   setSelectedShape(shape);
  // }, [setSelectedShape]);

  // const handlePositionChange = useCallback(positionChange(setSelectedShape), [setSelectedShape]);

  const handlePositionChange = useHOFCallback(positionChange, [setSelectedShape]);

  //

  // const handleStartShouldSetResponder = useCallback((event: any) => {
  //   event.preventDefault();

  //   const tap = !(Date.now() - lastTap.current < 300);
  //   lastTap.current = Date.now();

  //   return tap;
  // }, [lastTap.current]);

  // const handleStartShouldSetResponder = useMemo(() => startShouldSetResponder(lastTap), [lastTap]);
  const handleStartShouldSetResponder = useHOFCallback(startShouldSetResponder, [lastTap]);

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
    // if (currentTool.tool === 'GridDraw.Tools.Move') {
    onShapeUpdate(shape.id, {
      position: {
        x: shape.properties.position.x + event.nativeEvent.pageX - firstPosition.x,
        y: shape.properties.position.y + event.nativeEvent.pageY - firstPosition.y,
      }
    });
    // }
  }, [currentTool, shape.id, firstPosition, onShapeUpdate]);

  const handleResponseRelease = useCallback(event => {
    // if (currentTool.tool === 'GridDraw.Tools.Move') {
    console.log('----------');

    let position = {
      x: shape.properties.position.x + (event.nativeEvent.pageX - firstPosition.x),
      y: shape.properties.position.y + (event.nativeEvent.pageY - firstPosition.y),
    };

    onSetPosition(shape.id, position);
    // }
  }, [currentTool, firstPosition, onSetPosition]);

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
      {...(selectedShape ? selectedShape.properties : shape.properties)}
      stroke={selected ? 'hsl(210, 90%, 55%)' : undefined}
      strokeWidth={selected ? 5 : undefined}
      shapeId={shape.id}
      selected={selected}
      {...shapeEventProps}
    >
      <CanvasShapeList
        allShapes={allShapes}
        childIds={shape.childIds}
        selectedShapeIds={selectedShapeIds}
        onSetPosition={onSetPosition}
        onSelectShape={onSelectShape}
        onShapeUpdate={onShapeUpdate}
      />
    </Component>
  );
};

const _CanvasShapeList = ({ allShapes, childIds, selectedShapeIds, onSetPosition, onSelectShape, onShapeUpdate }) => {
  return (
    childIds.map(childId => {
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
    })
  );
};

const CanvasShape = React.memo(_CanvasShape);
const CanvasShapeList = React.memo(_CanvasShapeList);

export default CanvasShape;
