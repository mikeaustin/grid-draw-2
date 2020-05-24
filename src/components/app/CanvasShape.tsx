import React, { useState, useRef, useContext, useMemo, useEffect, useCallback } from 'react';

import shapeRegistry from './ShapeRegistry';
import AppContext from '../../AppContext';
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
  const { eventEmitter, onShapeUpdate, onPropertyChange } = useContext(AppContext);

  const lastTap = useRef<number>(Date.now());

  // const handlePositionChange = useCallback((shape: Shape) => {
  //   setSelectedShape(shape);
  // }, [setSelectedShape]);

  const handlePositionChange = useHOFCallback(positionChange, [setSelectedShape]);
  const handleStartShouldSetResponder = useHOFCallback(startShouldSetResponder, [lastTap]);

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
  }, [eventEmitter, selected, shape.properties, handlePositionChange]);

  // const handleStartShouldSetResponder = useCallback((event: any) => {
  //   event.preventDefault();

  //   const tap = !(Date.now() - lastTap.current < 300);
  //   lastTap.current = Date.now();

  //   return tap;
  // }, [lastTap.current]);


  const handleResponderGrant = useCallback((event: any) => {
    setFirstPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    onSelectShape(shape.id);

    setTimeout(() => {
      onShapeUpdate(shape.id, {
        position: shape.properties.position,
        opacity: shape.properties.opacity,
      });
    }, 0);
  }, [shape.id, setFirstPosition, shape.properties.position, shape.properties.opacity, onSelectShape, onShapeUpdate]);

  const handleResponderMove = useCallback(event => {
    onShapeUpdate(shape.id, {
      position: {
        x: shape.properties.position.x + event.nativeEvent.pageX - firstPosition.x,
        y: shape.properties.position.y + event.nativeEvent.pageY - firstPosition.y,
      }
    });
  }, [shape.id, shape.properties.position.x, shape.properties.position.y, firstPosition, onShapeUpdate]);

  const handleResponseRelease = useCallback(event => {
    console.log('----------');

    let position = {
      x: shape.properties.position.x + (event.nativeEvent.pageX - firstPosition.x),
      y: shape.properties.position.y + (event.nativeEvent.pageY - firstPosition.y),
    };

    onPropertyChange(shape.id, 'position', position);
  }, [shape.id, shape.properties.position.x, shape.properties.position.y, firstPosition, onPropertyChange]);

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
          onSelectShape={onSelectShape}
        />
      );
    })
  );
};

const CanvasShape = React.memo(_CanvasShape);
const CanvasShapeList = React.memo(_CanvasShapeList);

export default CanvasShape;
