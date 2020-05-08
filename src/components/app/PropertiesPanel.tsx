import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';

import Panel from '../shared/Panel';
import ShapeContext from '../../ShapeContext';
import { Spacer, Slider } from '../core';

const NumericInput = ({ value }) => {
  const styles = StyleSheet.create({
    numericInput: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 4,
      borderColor: '#c0c0c0',
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 5,
      height: 30,
    },
    input: {
      outlineWidth: 0,
      width: 40,
      marginRight: 3,
      marginTop: -1,
      textAlign: 'right'
    }
  });

  return (
    <View style={styles.numericInput}>
      <TextInput value={value} style={styles.input} />
      <Text>px</Text>
    </View>
  );
};

const Field = ({ label, value }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text>{label}</Text>
      <Spacer />
      <NumericInput value={value} />
    </View>
  );
};

const InputField = ({ label, shape, property, index }) => {
  return (
    <Field label={label} value={shape ? shape[property][index] : 0} />
  );
};

const PropertiesPanel = ({ selectedShapeId, dispatch, onShapeUpdate }) => {
  console.log('PropertiesPanel()');

  const handleSliderChange = opacity => {
    onShapeUpdate(selectedShapeId, {
      opacity: opacity
    });
  };

  const handleSlidingComplete = opacity => {
    dispatch({
      type: 'set-shape-opacity',
      payload: {
        shapeId: selectedShapeId,
        opacity
      }
    });
  };

  return (
    <Panel title="Properties">
      <View style={{ padding: 15 }}>
        <ShapeContext.Consumer>
          {selectedShape => (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Slider
                  value={selectedShape ? selectedShape.opacity : 0}
                  onValueChange={handleSliderChange}
                  onSlidingComplete={handleSlidingComplete}
                />
                <Spacer />
                <NumericInput value={selectedShape ? selectedShape.opacity : 0} />
              </View>
              <Spacer />
              <Field label="X" value={selectedShape ? selectedShape.position[0] : 0} />
              <InputField label="X" shape={selectedShape} property="position" index={0} />
            </>
          )}
        </ShapeContext.Consumer>
      </View>
    </Panel>
  );
};

export default React.memo(PropertiesPanel);
