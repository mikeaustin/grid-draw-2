/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';

const styles = StyleSheet.create({
  numericInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
    height: 30,
  },
  input: {
    outlineWidth: 0,
    width: 40,
    marginRight: 2,
    marginTop: -1,
    textAlign: 'right'
  },
  units: {
    width: 16,
  }
});

type UnitsProps = {
  label: string,
  [prop: string]: any,
};

const Units = React.memo(({ label, ...props }: UnitsProps) => {
  return (
    <Text {...props}>{label}</Text>
  );
});

type NumericInputProps = {
  value?: number,
  units?: string,
  scale?: number,
  onValueChange?: (value: any) => void,
  onValueCommit?: (value: any) => void,
};

const NumericInput = ({ value, scale = 1.0, units = 'px', onValueChange, onValueCommit, ...props }: NumericInputProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value ? Math.round(value * scale) : 0);
  }, [value, scale]);

  const handleChangeText = useCallback((value) => {
    setInternalValue(value);
  }, [setInternalValue]);

  const handleBlur = useCallback(() => {
    if (onValueCommit) {
      onValueCommit(internalValue ? internalValue / scale : 0);
    }
  }, [internalValue, scale, onValueCommit]);

  return (
    <View style={styles.numericInput}>
      <TextInput
        selectTextOnFocus
        value={internalValue}
        style={styles.input}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        {...props}
      />
      <Units label={units} style={styles.units} />
    </View>
  );
};

export default NumericInput;
