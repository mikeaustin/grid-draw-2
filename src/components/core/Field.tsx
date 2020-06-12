/* eslint @typescript-eslint/no-unused-vars: "off" */

import React from 'react';
import { View, Text } from 'react-native-web';

import { Spacer, NumericInput } from '../core';

type LabelProps = {
  label: string,
};

const Label = React.memo(({ label }: LabelProps) => {
  return (
    <>
      <Text>{label}</Text>
      <Spacer size="xsmall" />
    </>
  );
});

type FieldProps = {
  Component: React.FunctionComponent<any>,
  label?: string,
  value?: any,
  property?: string,
  flex?: boolean,
  units?: string,
  [prop: string]: any,
};

const Field = React.memo(({ Component, label, value, units, property, flex, ...props }: FieldProps) => {
  // console.log('Field()', value);

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, flex && { flex: 1 }]}>
      {label && <Label label={label} />}
      <Component value={value} {...props} units={units} />
    </View>
  );
});

export default Field;
