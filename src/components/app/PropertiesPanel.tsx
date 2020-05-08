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
  // console.log('Field()', value);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text>{label}</Text>
      <Spacer />
      <NumericInput value={value} {...props} />
    </View>
  );
});

const withProperty = (property, index) => Component => ({ shape, ...props }) => {
  const value = shape[property][index];

  return (
    <Component property={property} index={index} shapeId={shape.id} value={value} {...props} />
  );
};

type InputFieldProps = {
  label: string,
  value: any,
  property: string,
  index: number,
  shapeId: number,
  dispatch: Function,
};

const InputField = React.memo(({ label, property, index, value: defaultValue, shapeId, dispatch }: InputFieldProps) => {
  // console.log('InputField()', label);

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChangeText = useCallback((text) => setValue(text), []);

  const handleBlur = useCallback(event => {
    dispatch({
      type: 'SET_SHAPE_PROPERTY',
      payload: {
        shapeId: shapeId,
        property,
        index,
        value: Number(event.nativeEvent.text)
      }
    });
  }, [defaultValue]);

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
                <Spacer size="medium" />
                <NumericInput value={selectedShape ? selectedShape.opacity : 0} />
              </View>
              <Spacer size="medium" />
              <View style={{ flexDirection: 'row' }}>
                <Field label="X" value={selectedShape ? selectedShape.position[0] : 0} />
                <Spacer size="medium" />
                <InputField
                  label="X"
                  property="position"
                  index={0}
                  shapeId={selectedShapeId}
                  value={selectedShape ? selectedShape.position[0] : 0}
                  dispatch={dispatch}
                />
              </View>
            </>
          )}
        </ShapeContext.Consumer>
      </View>
    </Panel>
  );
};

export default React.memo(PropertiesPanel);
