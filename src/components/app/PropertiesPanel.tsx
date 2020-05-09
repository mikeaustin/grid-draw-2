import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';
import expr from 'property-expr';

import Panel from '../shared/Panel';
import ShapeContext from '../../ShapeContext';
import { Spacer, Divider, Slider, List } from '../core';

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
      <TextInput selectTextOnFocus value={value} style={styles.input} {...props} />
      <Text>px</Text>
    </View>
  );
};

type FieldProps = {
  label?: string,
  value: any,
  editable?: boolean,
  onChangeText?: Function,
  onBlur?: Function,
};

const Field = React.memo(({ label, value, ...props }: FieldProps) => {
  // console.log('Field()', value);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {label && (
        <>
          <Text>{label}</Text>
          <Spacer size="xsmall" />
        </>
      )}
      <NumericInput value={value} {...props} />
    </View>
  );
});

type InputFieldProps = {
  label?: string,
  property: string,
  value?: any,
  editable?: boolean,
};

const InputField = React.memo(({ label, property, value: defaultValue, editable, ...props }: InputFieldProps) => {
  // console.log('InputField()', label);

  const { dataSource, onPropertyChange } = useContext(FormContext);
  const propertyValue = dataSource ? expr.getter(property)(dataSource) : 0;
  const [value, setValue] = useState(propertyValue);

  useEffect(() => {
    setValue(propertyValue);
  }, [propertyValue]);

  const handleChangeText = useCallback((text) => {
    setValue(text);
  }, []);

  const handleBlur = useCallback(event => {
    if (editable) {
      onPropertyChange(property, Number(event.nativeEvent.text));
    }
  }, [propertyValue]);

  return (
    <Field label={label} value={value} editable={editable} onChangeText={handleChangeText} onBlur={handleBlur} {...props} />
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
          <Form dataSource={selectedShape} style={{ padding: 5 }} onPropertyChange={handlePropertyChange}>
            <List divider spacerSize="xsmall">
              <Section title="Position">
                <List horizontal spacerSize="large">
                  <InputField label="X" property="position[0]" editable={selectedShape} />
                  <InputField label="Y" property="position[1]" editable={selectedShape} />
                </List>
              </Section>
              <Section title="Opacity">
                <List horizontal spacerSize="small">
                  <Slider
                    value={selectedShape ? selectedShape.opacity : 0}
                    disabled={!selectedShape}
                    onValueChange={handleSliderChange}
                    onSlidingComplete={handleSlidingComplete}
                  />
                  <InputField property="opacity" editable={selectedShape} />
                </List>
              </Section>
              <Section title="Angle">
                <List horizontal spacerSize="small">
                  <Slider
                    value={selectedShape ? selectedShape.opacity : 0}
                    disabled={!selectedShape}
                    onValueChange={handleSliderChange}
                    onSlidingComplete={handleSlidingComplete}
                  />
                  <InputField property="angle" />
                </List>
              </Section>
            </List>
          </Form>
        )}
      </ShapeContext.Consumer>
    </Panel>
  );
};

const Section = ({ title, children }) => {
  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 12, fontWeight: 700 }}>{title}</Text>
      <Spacer size="small" />
      {children}
    </View>
  );
};

export default React.memo(PropertiesPanel);
