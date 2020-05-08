import React from 'react';
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

export {
  Spacer,
  Divider,
  List,
};
