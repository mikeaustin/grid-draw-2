import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native-web';

import Form from './Form';
import NumericInput from './NumericInput';
import Field from './Field';
import PropertyField from './PropertyField';

type Size = 'none' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

type SpacerProps = {
  size: Size;
};

const Spacer = ({ size }: SpacerProps) => {
  const styles = StyleSheet.create({
    none: {
      minWidth: 0,
      minHeight: 0,
    },
    xsmall: {
      minWidth: 5,
      minHeight: 5,
    },
    small: {
      minWidth: 10,
      minHeight: 10,
    },
    medium: {
      minWidth: 15,
      minHeight: 15,
    },
    large: {
      minWidth: 20,
      minHeight: 20,
    },
  });

  return (
    <View style={styles[size]} />
  );
};

type DividerProps = {
  color?: string,
  spacerSize?: Size,
};

const Divider = ({ spacerSize = 'none', color = '#e8e8e8' }: DividerProps) => {
  return (
    <>
      <Spacer size={spacerSize} />
      <View style={{ background: color, minWidth: 1, minHeight: 1 }} />
      <Spacer size={spacerSize} />
    </>
  );
};

type ListProps = {
  horizontal?: boolean,
  spacerSize?: Size,
  divider?: boolean,
  dividerColor?: string,
  style?: object,
  children: React.ReactNode,
};

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  }
});

const List = ({ horizontal, spacerSize = 'none', divider, dividerColor, style, children, ...props }: ListProps) => {
  const separator = divider ? <Divider color={dividerColor} spacerSize={spacerSize} /> : <Spacer size={spacerSize} />;

  return (
    <View style={[horizontal && styles.horizontal, style]} {...props}>
      {React.Children.map(children, (child, index) => (
        <>
          {index > 0 && React.isValidElement(child) && separator}
          {child}
        </>
      ))}
    </View>
  );
};

const Slider = ({ value: defaultValue, onValueChange, onValueCommit, ...props }) => {
  const [value, setValue] = useState(defaultValue || 0);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleOnChange = event => {
    setValue(event.target.value / 100);
    onValueChange(event.target.value / 100);
  };

  const handleMouseUp = event => {
    onValueCommit(value);
  };

  return (
    <input
      type="range"
      min={0}
      value={value * 100}
      tabIndex={-1}
      style={{ flex: 1, marginTop: 12.5, marginBottom: 12.5 }}
      onChange={handleOnChange}
      onMouseUp={handleMouseUp}
      {...props}
    />
  );
};

export {
  Spacer,
  Divider,
  List,
  Slider,
  Form,
  NumericInput,
  Field,
  PropertyField,
};
