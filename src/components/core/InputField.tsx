import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import expr from 'property-expr';

import { Field } from '../core';
import ShapeContext from '../../ShapeContext';
import FormContext from '../core/FormContext';

const useSelectedShape = (property: string) => {
  const [selectedShape, setSelectedShape] = useState<any | null>(null);
  const { eventEmitter } = useContext(ShapeContext);

  useEffect(() => {
    eventEmitter.addListener(property, handlePositionChange);
  }, []);

  const handlePositionChange = (shape) => {
    setSelectedShape(shape);
  };

  return selectedShape;
};

type InputFieldProps = {
  label?: string,
  property: string,
  value?: any,
  editable?: boolean,
};

const PropertyField = ({
  label,
  property,
  ...props
}: InputFieldProps) => {
  const index = property.search(/[\.\[]/);
  const rootProperty = index >= 0 ? property.slice(0, index) : property;
  const selectedShape = useSelectedShape(rootProperty);

  const getter = useMemo(() => expr.getter(property), [property]);

  const { onShapeUpdate, onPropertyChange } = useContext(FormContext);
  const propertyValue = selectedShape ? getter(selectedShape) : 0;

  const handleValueChange = text => {
    onShapeUpdate(property, Number(text));
  };

  const handleBlur = useCallback(text => {
    onPropertyChange(property, Number(text));
  }, [property, propertyValue]);

  return (
    <Field
      label={label}
      value={propertyValue}
      onValueChange={handleValueChange}
      onValueCommit={handleBlur}
      {...props}
    />
  );
};

export default React.memo(PropertyField);
