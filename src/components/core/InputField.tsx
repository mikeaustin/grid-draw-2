import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';
import expr from 'property-expr';

import { Spacer, Divider, Slider, List, Form, NumericInput, Field } from '../core';
import FormContext from '../core/FormContext';

type InputFieldProps = {
  label?: string,
  property: string,
  value?: any,
  editable?: boolean,
};

const InputField = React.memo(({ label, property, value: defaultValue, editable, ...props }: InputFieldProps) => {
  // console.log('InputField()', label);

  const { dataSource, onPropertyChange } = useContext(FormContext);
  const propertyValue = dataSource ? expr.getter(property)(dataSource) : 0;
  const [value, setValue] = useState(propertyValue);

  useEffect(() => {
    setValue(propertyValue);
  }, [propertyValue]);

  const handleChangeText = useCallback((text) => {
    setValue(text);
  }, []);

  const handleBlur = useCallback(event => {
    if (editable) {
      onPropertyChange(property, Number(event.nativeEvent.text));
    }
  }, [propertyValue]);

  return (
    <Field label={label} value={value} editable={editable} onChangeText={handleChangeText} onBlur={handleBlur} {...props} />
  );
});

export default InputField;
