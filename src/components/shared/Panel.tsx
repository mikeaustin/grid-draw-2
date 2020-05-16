import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native-web';

const styles = StyleSheet.create({
  panel: {
    width: 256, backgroundColor: '#f8f8f8',
  },
  title: {
    paddingHorizontal: 15,
    height: 31,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
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
