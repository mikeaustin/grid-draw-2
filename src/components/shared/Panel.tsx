import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native-web';

const styles = StyleSheet.create({
  panel: {
    width: 256, backgroundColor: '#f4f4f4',
  },
  title: {
    paddingHorizontal: 15,
    height: 31,
    backgroundColor: '#e8e8e8',
    // backgroundColor: '#f4f4f4',
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

export default React.memo(Panel);
