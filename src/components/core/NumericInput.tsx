import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
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

const NumericInput = ({ value, ...props }) => {
  return (
    <View style={styles.numericInput}>
      <TextInput selectTextOnFocus value={value} style={styles.input} {...props} />
      <Text>px</Text>
    </View>
  );
};

export default NumericInput;
