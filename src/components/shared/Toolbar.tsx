import React from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';

import Spacer from '../shared/Spacer';

const Divider = () => {
  return (
    <>
      <Spacer />
      <View style={{ background: '#e0e0e0', minWidth: 1, minHeight: 1 }} />
      <Spacer />
    </>
  );
};

const List = ({ divider, children }) => {
  const Separator = divider ? Divider : Spacer;

  return (
    <View style={{ flexDirection: 'row' }}>
      {React.Children.map(children, (child, index) => (
        <>
          {index > 0 && <Separator />}
          {child}
        </>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 2,
    outlineWidth: 1,
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: 'hsla(0, 0%, 0%, 0.1)'
  },
  active: {
    backgroundColor: 'hsla(0, 0%, 0%, 0.15)'
  },
  toolbar: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#f3f3f3',
    borderBottomWidth: 1,
    borderColor: 'hsl(0, 0%, 80%)',
  }
});

const Toolbar = ({ children, onButtonPress }) => {
  return (
    <View style={styles.toolbar}>
      <List divider>
        {React.Children.map(children, child => (
          React.cloneElement(child, {
            onButtonPress,
          })
        ))}
      </List>
    </View>
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
  title: string,
  name?: string,
  selectedValue?: any,
  children: React.ReactNode,
  onButtonPress?: any,
};

const Group = ({ title, name, selectedValue, children, onButtonPress }: GroupProps) => {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 5 }}>
      <View style={{ flexDirection: 'row' }}>
        {React.Children.map(children, (child, index) => (
          <>
            {index > 0 && <Spacer />}
            {React.isValidElement(child) && React.cloneElement(child, {
              selected: child.props.selected || selectedValue && equals(child.props.value, selectedValue),
              onDispatch: value => onButtonPress(name, value)
            })}
          </>
        ))}
      </View>
      <Spacer />
      <Text style={{ fontSize: 12 }}>{title}</Text>
    </View>
  );
};

type ButtonProps = {
  icon: string,
  value?: any,
  selected?: boolean,
  onDispatch?: any,
};

const Button = ({ icon, value, selected, onDispatch }: ButtonProps) => {
  const onPress = () => {
    onDispatch(value);
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, selected && styles.selected]}>
        <Image source={{ uri: `images/icons/${icon}.svg` }} style={{ width: 25, height: 25 }} />
      </View>
    </TouchableWithoutFeedback>
  );
};

Toolbar.Group = Group;
Toolbar.Button = Button;

export default Toolbar;
