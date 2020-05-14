import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import expr from 'property-expr';

import { Field } from '../core';
import ShapeContext from '../../ShapeContext';
import FormContext from '../core/FormContext';

const useSelectedShape = (property: string) => {
  const [selectedShape, setSelectedShape] = useState<any | null>(null);
  const { eventEmitter } = useContext(ShapeContext);

  const handlePositionChange = (shape) => {
    setSelectedShape(shape);
  };

  useEffect(() => {
    eventEmitter.addListener(property, handlePositionChange);
  }, [eventEmitter, property]);

  return selectedShape;
};

type InputFieldProps = {
  Component: React.FunctionComponent<any>,
  label?: string,
  property: string,
  value?: any,
  editable?: boolean,
  max?: string,
};

const PropertyField = ({
  Component,
  label,
  property,
  ...props
}: InputFieldProps) => {
  const index = property.search(/[\.\[]/);
  const rootProperty = index >= 0 ? property.slice(0, index) : property;
  const selectedShape = useSelectedShape(rootProperty);

  const getter = useMemo(() => expr.getter(property), [property]);

  const { onShapeUpdate, onPropertyChange } = useContext(FormContext);
  const propertyValue = selectedShape ? getter(selectedShape.properties) : 0;

  const handleValueChange = text => {
    onShapeUpdate(property, Number(text));
  };

  const handleBlur = text => {
    onPropertyChange(property, Number(text));
  };

  return (
    <Field
      Component={Component}
      label={label}
      value={propertyValue}
      onValueChange={handleValueChange}
      onValueCommit={handleBlur}
      {...props}
    />
  );
};

// const withField = Component => ({ ...props }) => {
//   return <PropertyField Component={Component} {...props} />;
// };

export default React.memo(PropertyField);
