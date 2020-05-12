import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';
import expr from 'property-expr';

import { Spacer, Divider, Slider, List, Form, NumericInput, Field } from '../core';
import FormContext from '../core/FormContext';

const useSelectedShape = (rootProperty: string) => {
  const [selectedShape, setSelectedShape] = useState<any | null>(null);

  useEffect(() => {
    document.addEventListener(rootProperty, handleShapeMove);
  }, []);

  const handleShapeMove = useCallback(event => {
    // console.log(event.detail);

    setSelectedShape(event.detail);
  }, []);

  return selectedShape;
};

type InputFieldProps = {
  label?: string,
  property: string,
  value?: any,
  editable?: boolean,
};

const InputField = ({ label, property, value: defaultValue, ...props }: InputFieldProps) => {
  // console.log('InputField()', label);
  const index = property.search(/[\.\[]/);
  const rootProperty = index >= 0 ? property.slice(0, index) : property;
  console.log(rootProperty);

  const selectedShape = useSelectedShape(rootProperty);

  const getter = useMemo(() => expr.getter(property), [property]);

  const { onPropertyChange } = useContext(FormContext);
  const propertyValue = selectedShape ? getter(selectedShape) : 0;
  const [value, setValue] = useState(propertyValue);

  useEffect(() => {
    setValue(propertyValue);
  }, [propertyValue]);

  const handleChangeText = useCallback((text) => {
    setValue(text);
  }, []);

  const handleBlur = useCallback(event => {
    onPropertyChange(property, Number(event.nativeEvent.text));
  }, [property, propertyValue]);

  return (
    <Field
      label={label}
      value={value}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export default React.memo(InputField);
