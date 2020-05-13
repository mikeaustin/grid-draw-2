import React from 'react';
import { View, Text } from 'react-native-web';

import { Spacer, NumericInput } from '../core';

type FieldProps = {
  Component: React.FunctionComponent<any>,
  label?: string,
  value: any,
  editable?: boolean,
  onValueChange?: Function,
  onValueCommit?: Function,
  onBlur?: Function,
};

const Field = ({ Component, label, value, ...props }: FieldProps) => {
  // console.log('Field()', value);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
