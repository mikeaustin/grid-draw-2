import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';
import expr from 'property-expr';

import Panel from '../shared/Panel';
import ShapeContext from '../../ShapeContext';
import { Spacer, Slider } from '../core';

const FormContext = React.createContext<any>(null);

const Form = ({ dataSource, children, onPropertyChange, ...props }) => {
  const value = useMemo<any>(() => ({
    dataSource,
    onPropertyChange: (name: string, value: any) => {
      onPropertyChange(name, value);
    }
  }), [dataSource, onPropertyChange]);

  return (
    <FormContext.Provider value={value}>
      <View {...props}>
        {children}
      </View>
    </FormContext.Provider>
  );
};

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

type InputFieldProps = {
  label: string,
  property: string,
  value?: any,
};

const InputField = React.memo(({ label, property, value: defaultValue }: InputFieldProps) => {
  // console.log('InputField()', label);

  const { dataSource, onPropertyChange } = useContext(FormContext);
  const [value, setValue] = useState(dataSource ? dataSource[property][0] : '');

  useEffect(() => {
    setValue(dataSource ? dataSource[property][0] : '');
  }, [dataSource ? dataSource[property][0] : '']);

  const handleChangeText = useCallback((text) => setValue(text), []);

  const handleBlur = useCallback(event => {
    onPropertyChange(property, Number(event.nativeEvent.text));
  }, [dataSource ? dataSource[property][0] : '']);

  return (
    <Field label={label} value={value} onChangeText={handleChangeText} onBlur={handleBlur} />
  );
});

const PropertiesPanel = ({ selectedShapeId, dispatch, onShapeUpdate }) => {
  console.log('PropertiesPanel()', selectedShapeId);

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

  const handlePropertyChange = (name, value) => {
    console.log('handlePropertyChange()', selectedShapeId, name, value);

    dispatch({
      type: 'SET_SHAPE_PROPERTY',
      payload: {
        shapeId: selectedShapeId,
        property: name,
        index: 0,
        value: value,
      }
    });
  };

  return (
    <Panel title="Properties">
      <ShapeContext.Consumer>
        {selectedShape => (
          <Form dataSource={selectedShape} style={{ padding: 15 }} onPropertyChange={handlePropertyChange}>
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
              />
            </View>
          </Form>
        )}
      </ShapeContext.Consumer>
    </Panel>
  );
};

export default React.memo(PropertiesPanel);
