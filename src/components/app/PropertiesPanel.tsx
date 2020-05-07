import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';

import Panel from '../shared/Panel';
import ShapeContext from '../../ShapeContext';
import { Spacer } from '../core';

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
    // {...props}
    />
  );
};

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

const PropertiesPanel = ({ selectedShapeId, allShapes, dispatch, onShapeUpdate }) => {
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>X</Text>
                <Spacer />
                <NumericInput value={selectedShape ? selectedShape.position[0] : 0} />
              </View>
            </>
          )}
        </ShapeContext.Consumer>
      </View>
    </Panel>
  );
};

export default React.memo(PropertiesPanel);
