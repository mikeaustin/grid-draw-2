import React, { useMemo } from 'react';
import { View } from 'react-native-web';

import FormContext from './FormContext';

const Form = ({ children, onShapeUpdate, onPropertyChange, ...props }) => {
  const value = useMemo<any>(() => ({
    onShapeUpdate,
    onPropertyChange
  }), [onShapeUpdate, onPropertyChange]);

  return (
    <FormContext.Provider value={value}>
      <View {...props}>
        {children}
      </View>
    </FormContext.Provider>
  );
};

export default Form;
