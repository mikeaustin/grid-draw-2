import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native-web';

const Spacer = ({ size = 'small' }) => {
  const styles = StyleSheet.create({
    small: {
      minWidth: 5,
      minHeight: 5,
    },
    medium: {
      minWidth: 10,
      minHeight: 10,
    },
  });
  return (
    <View style={styles[size]} />
  );
};

type DividerProps = {
  spacerSize?: string,
};

const Divider = ({ spacerSize = 'small' }: DividerProps) => {
  return (
    <>
      <Spacer size={spacerSize} />
      <View style={{ background: '#e0e0e0', minWidth: 1, minHeight: 1 }} />
      <Spacer size={spacerSize} />
    </>
  );
};

type ListProps = {
  horizontal?: boolean,
  spacerSize?: string,
  divider?: boolean,
  children: React.ReactNode,
};

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  }
});

const List = ({ horizontal, spacerSize = 'small', divider, children }: ListProps) => {
  const separator = divider ? <Divider spacerSize={spacerSize} /> : <Spacer size={spacerSize} />;

  return (
    <View style={horizontal && styles.horizontal}>
      {React.Children.map(children, (child, index) => (
        <>
          {index > 0 && separator}
          {child}
        </>
      ))}
    </View>
  );
};

const Slider = ({ value: defaultValue, onValueChange, onSlidingComplete, ...props }) => {
  const [value, setValue] = useState(defaultValue || 0);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleOnChange = event => {
    setValue(event.target.value / 100);
    onValueChange(event.target.value / 100);
  };

  const handleMouseUp = event => {
    onSlidingComplete(value);
  };

  return (
    <input
      type="range"
      min={0}
      value={value * 100}
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
};
