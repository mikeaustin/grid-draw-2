import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native-web';

import { Spacer, Divider, Slider, List, Form, NumericInput, Field, InputField } from '../core';
import Panel from '../shared/Panel';
import ShapeContext from '../../ShapeContext';

const PropertiesPanel = ({ selectedShapeId, dispatch, onShapeUpdate }) => {
  console.log('PropertiesPanel()', selectedShapeId);

  // const [selectedShape, setSelectedShape] = useState<any | null>(null);

  // useEffect(() => {
  //   document.addEventListener('shapemove', handleShapeMove);
  // }, []);

  // const handleShapeMove = useCallback(event => {
  //   // console.log(event.detail);

  //   // setSelectedShape(event.detail);
  // }, []);

  const handleSliderChange = useCallback(opacity => {
    onShapeUpdate(selectedShapeId, {
      opacity: opacity
    });
  }, [onShapeUpdate]);

  const handleSlidingComplete = useCallback(opacity => {
    dispatch({
      type: 'SET_SHAPE_PROPERTY',
      payload: {
        shapeId: selectedShapeId,
        property: 'opacity',
        value: opacity,
      }
    });
  }, [dispatch]);

  const handlePropertyChange = useCallback((name, value) => {
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
  }, [selectedShapeId, dispatch]);

  return (
    <Panel title="Properties">
      <Form style={{ padding: 5 }} onPropertyChange={handlePropertyChange}>
        <List divider spacerSize="xsmall">
          <Section title="Position">
            <List horizontal spacerSize="large">
              <InputField label="X" property="position[0]" />
              <InputField label="Y" property="position[1]" />
            </List>
          </Section>
          <Section title="Opacity">
            <List horizontal spacerSize="small">
              {/* <Slider
                value={selectedShape ? selectedShape.opacity : 0}
                disabled={!selectedShape}
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSlidingComplete}
              /> */}
              <InputField label="opacity" property="opacity" />
            </List>
          </Section>
        </List>
      </Form>
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
