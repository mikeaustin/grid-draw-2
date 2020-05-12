import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';

import { Spacer, Divider, Slider, List, Form, NumericInput } from '../core';

type FieldProps = {
  label?: string,
  value: any,
  editable?: boolean,
  onChangeText?: Function,
  onBlur?: Function,
};

const Field = ({ label, value, ...props }: FieldProps) => {
  // console.log('Field()', value);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {label && (
        <>
          <Text>{label}</Text>
          <Spacer size="xsmall" />
        </>
      )}
      <NumericInput value={value} {...props} />
    </View>
  );
};

export default React.memo(Field);
