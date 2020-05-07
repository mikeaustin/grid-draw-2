import React, { useState, useReducer, useRef, useMemo, SyntheticEvent, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native-web';

const styles = StyleSheet.create({
  panel: {
    width: 256, backgroundColor: '#f3f3f3',
    borderWidth: 1,
    borderColor: 'hsl(0, 0%, 80%)',
    margin: -1,
  },
  title: {
    paddingHorizontal: 15,
    height: 31,
    backgroundColor: '#e8e8e8',
    borderBottomWidth: 1,
    borderColor: '#d0d0d0',
    justifyContent: 'center'
  }
});

const Panel = ({ title, children, ...props }) => {
  return (
    <View style={styles.panel} {...props}>
      <View style={styles.title}>
        <Text style={{ fontWeight: 600 }}>{title}</Text>
      </View>
      <ScrollView>
        {children}
      </ScrollView>
    </View>
  );

};

export default Panel;
