import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import expr from 'property-expr';

import { Field } from '.';
import { AppContext } from '../../AppContext';
import FormContext from './FormContext';

const useSelectedShape = (property: string) => {
  const [selectedShape, setSelectedShape] = useState<any | null>(null);
  const { eventEmitter } = useContext(AppContext);

  const handlePositionChange = useCallback((shape) => {
    setSelectedShape(shape);
  }, []);

  useEffect(() => {
    eventEmitter.addListener(property, handlePositionChange);
  }, [eventEmitter, property, handlePositionChange]);

  return selectedShape;
};

//
//
//

type InputFieldProps = {
  Component: React.FunctionComponent<any>,
  label?: string,
  property: string,
  value?: any,
  editable?: boolean,
  max?: string,
  flex?: boolean,
};

const PropertyField = ({
  Component,
  label,
  property,
  ...props
}: InputFieldProps) => {
  // console.log('PropertyField()');

  const index = property.indexOf('.');
  const rootProperty = index >= 0 ? property.slice(0, index) : property;
  const selectedShape = useSelectedShape(rootProperty);

  const getter = useMemo(() => expr.getter(property), [property]);

  const { onShapeUpdate, onPropertyChange } = useContext(FormContext);
  const propertyValue = selectedShape ? getter(selectedShape.properties) : 0;

  const handleValueChange = useCallback(text => {
    onShapeUpdate(property, Number(text));
  }, [property, onShapeUpdate]);

  const handleBlur = useCallback(text => {
    onPropertyChange(property, Number(text));
  }, [property, onPropertyChange]);

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

export default React.memo(PropertyField);
