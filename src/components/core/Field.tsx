import React from 'react';
import { View, Text } from 'react-native-web';

import { Spacer, NumericInput } from '../core';

type FieldProps = {
  Component: React.FunctionComponent<any>,
  label?: string,
  value?: any,
  property?: string,
  editable?: boolean,
  flex?: boolean,
  onValueChange?: Function,
  onValueCommit?: Function,
  onBlur?: Function,
  max?: string,
};

const Field = ({ Component, label, value, property, flex, ...props }: FieldProps) => {
  // console.log('Field()', value);

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, flex && { flex: 1 }]}>
      {label && (
        <>
          <Text>{label}</Text>
          <Spacer size="xsmall" />
        </>
      )}
      <Component value={value} {...props} />
    </View>
  );
};

export default React.memo(Field);
