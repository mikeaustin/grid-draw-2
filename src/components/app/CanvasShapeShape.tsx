/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useState, useRef, useContext, useMemo, useEffect, useCallback } from 'react';

import shapeRegistry from './ShapeRegistry';
import { AppContext, SelectedShapeContext } from '../../AppContext';
import { State, Shape, Properties } from '../../types';
import { useEvent, useSelf } from '../../utilities/hooks';

const CanvasShapeShape = ({ Component, shape, selected, ...props }) => {
  // console.log('CanvasShapeShape()', selected);

  const [selectedShape, setSelectedShape] = useState<any | null>(null);
  const { eventEmitter } = useContext(AppContext);

  const handlePositionChange = useCallback((shape: Shape) => {
    setSelectedShape(shape);
  }, []);

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

    return () => {
      Object.keys(shape.properties).forEach(propertyName => {
        eventEmitter.removeListener(propertyName, handlePositionChange);
      });
    };
  }, [selected, shape.properties, eventEmitter, handlePositionChange]);

  return (
    <Component
      properties={selectedShape ? selectedShape.properties : shape.properties}
      stroke={selected ? 'hsl(210, 90%, 55%)' : 'black'}
      strokeWidth={selected ? 3 : 3}
      shapeId={shape.id}
      selected={selected}
      {...props}
    />
  );
};

export default React.memo(CanvasShapeShape);
