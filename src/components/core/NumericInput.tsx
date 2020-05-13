import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';

const styles = StyleSheet.create({
  numericInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#c0c0c0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
    height: 30,
  },
  input: {
    outlineWidth: 0,
    width: 40,
    marginRight: 3,
    marginTop: -1,
    textAlign: 'right'
  }
});

type NumericInputProps = {
  value: number,
  onValueChange?: Function,
  onValueCommit?: Function,
};

const NumericInput = ({ value, onValueChange, onValueCommit, ...props }: NumericInputProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChangeText = (value) => {
    setInternalValue(value);
  };

  const handleBlur = () => {
    if (onValueCommit) {
      onValueCommit(internalValue);
    }
  };

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
      <Text>px</Text>
    </View>
  );
};

export default NumericInput;
