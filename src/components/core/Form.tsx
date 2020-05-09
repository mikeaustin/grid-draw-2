import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';

import FormContext from './FormContext';

const Form = ({ dataSource, children, onPropertyChange, ...props }) => {
  const value = useMemo<any>(() => ({
    dataSource,
    onPropertyChange: (name: string, value: any) => {
      onPropertyChange(name, value);
    }
  }), [dataSource, onPropertyChange]);

  return (
    <FormContext.Provider value={value}>
      <View {...props}>
        {children}
      </View>
    </FormContext.Provider>
  );
};

export default Form;
