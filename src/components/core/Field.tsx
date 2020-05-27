/* eslint @typescript-eslint/no-unused-vars: "off" */

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

const _Label = ({ label }) => {
  return (
    <>
      <Text>{label}</Text>
      <Spacer size="xsmall" />
    </>
  );
};

const Field = ({ Component, label, value, property, flex, ...props }: FieldProps) => {
  // console.log('Field()', value);

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, flex && { flex: 1 }]}>
      {label && <Label label={label} />}
      <Component value={value} {...props} />
    </View>
  );
};

const Label = React.memo(_Label);

export default React.memo(Field);
