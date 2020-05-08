import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';

import Panel from '../shared/Panel';
import ShapeContext from '../../ShapeContext';
import { Spacer, Slider } from '../core';

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

const NumericInput = ({ value, ...props }) => {
  return (
    <View style={styles.numericInput}>
      <TextInput value={value} style={styles.input} {...props} />
      <Text>px</Text>
    </View>
  );
};

type FieldProps = {
  label: string,
  value: any,
  onChangeText?: Function,
  onBlur?: Function,
};

const Field = React.memo(({ label, value, ...props }: FieldProps) => {
  console.log('Field()', value);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text>{label}</Text>
      <Spacer />
      <NumericInput value={value} {...props} />
    </View>
  );
});

type InputFieldProps = {
  label: string,
  shape: any,
  property: string,
  index: number,
  dispatch: Function,
};

const withProperty = property => Component => ({ ...props }) => {
  return (
    <Component property={property} {...props} />
  );
};

const InputField = React.memo(({ label, shape, property, index, dispatch }: InputFieldProps) => {
  console.log('InputField()', label);

  const [value, setValue] = useState(shape ? shape[property][index] : 0);

  useEffect(() => {
    setValue(shape ? shape[property][index] : 0);
  }, [shape && shape[property]]);

  const handleChangeText = useCallback((text) => setValue(text), []);

  const handleBlur = useCallback(event => {
    dispatch({
      type: 'SET_SHAPE_PROPERTY',
      payload: {
        shapeId: shape.id,
        property,
        index,
        value: Number(event.nativeEvent.text)
      }
    });
  }, [shape && shape[property]]);

  return (
    <Field label={label} value={value} onChangeText={handleChangeText} onBlur={handleBlur} />
  );
});

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
              <InputField label="X" shape={selectedShape} property="position" index={0} dispatch={dispatch} />
            </>
          )}
        </ShapeContext.Consumer>
      </View>
    </Panel>
  );
};

export default React.memo(PropertiesPanel);
