import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableWithoutFeedback } from 'react-native-web';

import Panel from '../shared/Panel';
import ShapeContext from '../../ShapeContext';

const Slider = ({ value: defaultValue, onValueChange, onSlidingComplete }) => {
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
      onChange={handleOnChange}
      onMouseUp={handleMouseUp}
    />
  );
};

const styles = StyleSheet.create({
  panel: {
    width: 256, backgroundColor: '#f3f3f3',
    borderLeftWidth: 1,
    borderColor: 'hsl(0, 0%, 80%)',
  }
});

const PropertiesPanel = ({ selectedShapeId, selectedShapeElement, allShapes, dispatch }) => {
  console.log('PropertiesPanel');

  const handleSliderChange = opacity => {
    selectedShapeElement?.setAttribute('opacity', opacity);
  };

  const handleSlidingComplete = opacity => {
    dispatch({ type: 'set-shape-opacity', payload: { shapeId: selectedShapeId, opacity } });
  };

  return (
    <Panel title="Properties">
      <View style={{ padding: 15 }}>
        <ShapeContext.Consumer>
          {data => (
            <>
              <Slider
                value={allShapes[selectedShapeId]?.opacity}
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSlidingComplete}
              />
              <TextInput value={selectedShapeElement ? selectedShapeElement.getAttribute('cx') : 0} />
              <TextInput value={data[0]} />
            </>
          )}
        </ShapeContext.Consumer>
      </View>
    </Panel>
  );
};

export default React.memo(PropertiesPanel);
