import React from 'react';
import { View, Text } from 'react-native-web';

import { Spacer, NumericInput } from '../core';

type FieldProps = {
  label?: string,
  value: any,
  editable?: boolean,
  onValueChange?: Function,
  onValueCommit?: Function,
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
