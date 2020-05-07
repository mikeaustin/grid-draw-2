import React, { useState, useReducer, useRef, useMemo, SyntheticEvent, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';

const Spacer = () => {
  return (
    <View style={{ minWidth: 5, minHeight: 5 }} />
  );
};

export default Spacer;
