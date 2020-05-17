import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';

import { Spacer, Divider, List } from '../core';
import { Size } from '../../types';

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 2,
    outlineWidth: 1,
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: '#e8e8e8',
  },
  pressed: {
    backgroundColor: '#d8d8d8',
  },
  toolbar: {
    flexDirection: 'row',
    paddingVertical: 5,
    backgroundColor: '#f8f8f8',
    minHeight: 40,
  }
});

type ToolbarProps = {
  spacerSize?: Size,
  children: React.ReactNode,
  onButtonPress?: Function,
};

const Toolbar = ({ spacerSize, children, onButtonPress }: ToolbarProps) => {
  return (
    <List horizontal divider spacerSize={spacerSize} style={styles.toolbar}>
      {React.Children.map(children, child => (
        React.isValidElement(child) && React.cloneElement(child, {
          onButtonPress,
        })
      ))}
    </List>
  );
};

const equals = (a, b) => {
  if (a === b) {
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return Object.keys(a).every((key) => (
      a[key] === b[key]
    ));
  }

  return false;
};

type GroupProps = {
  title?: string,
  name?: string,
  selectedValue?: any,
  children: React.ReactNode,
  onButtonPress?: Function,
};

const Group = ({ title, name, selectedValue, children, onButtonPress }: GroupProps) => {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 15, xpaddingVertical: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {React.Children.map(children, (child, index) => (
          <>
            {index > 0 && <Spacer size="xsmall" />}
            {React.isValidElement(child) && React.cloneElement(child, {
              selected: child.props.selected || selectedValue && equals(child.props.value, selectedValue),
              onDispatch: value => onButtonPress && onButtonPress(name, value)
            })}
          </>
        ))}
      </View>
      {title && (
        <>
          <Spacer size="xsmall" />
          <Text style={{ fontSize: 12 }}>{title}</Text>
        </>
      )}
    </View>
  );
};

type ButtonProps = {
  icon: string,
  value?: any,
  selected?: boolean,
  onDispatch?: Function,
};

const Button = ({ icon, value, selected, onDispatch }: ButtonProps) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  const handlePress = () => {
    onDispatch && onDispatch(value);
  };

  const buttonStyle = [
    styles.button,
    selected && styles.selected,
    pressed && styles.pressed,
  ];

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
      <View style={buttonStyle}>
        <Image source={{ uri: `images/icons/${icon}` }} style={{ width: 25, height: 25 }} />
      </View>
    </TouchableWithoutFeedback>
  );
};

Toolbar.Group = Group;
Toolbar.Button = Button;

export default Toolbar;
