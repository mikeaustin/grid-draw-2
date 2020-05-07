import React, { useState, useReducer, useRef, useMemo, SyntheticEvent, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';

const Spacer = () => {
  return (
    <View style={{ minWidth: 5, minHeight: 5 }} />
  );
};

const Divider = () => {
  return (
    <>
      <Spacer />
      < View style={{ background: '#e0e0e0', minWidth: 1, minHeight: 1 }} />
      < Spacer />
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

export {
  Spacer,
  Divider,
  List,
};
