import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput } from 'react-native-web';

import { Spacer, Slider, List, Form, NumericInput, Field, PropertyField } from '../core';
import Panel from '../shared/Panel';

const PropertiesPanel = ({ selectedShapeId, dispatch, onShapeUpdate }) => {
  console.log('PropertiesPanel()', selectedShapeId);

  const handleShapeUpdate = (name, value) => {
    // console.log('handleShpaeUpdate()', name, value);

    onShapeUpdate(selectedShapeId, {
      [name]: value,
    });
  };

  const handlePropertyChange = (name, value) => {
    // console.log('handlePropertyChange()', selectedShapeId, name, value);

    dispatch({
      type: 'SET_SHAPE_PROPERTY',
      payload: {
        shapeId: selectedShapeId,
        property: name,
        value: value,
      }
    });
  };

  return (
    <Panel title="Properties">
      <Form style={{ padding: 5 }} onShapeUpdate={handleShapeUpdate} onPropertyChange={handlePropertyChange}>
        <List divider spacerSize="xsmall">
          <Section title="Position">
            <List horizontal spacerSize="large">
              <PropertyField Component={NumericInput} label="X" property="position[0]" />
              <PropertyField Component={NumericInput} label="Y" property="position[1]" />
            </List>
          </Section>
          <Section title="Opacity">
            <List horizontal spacerSize="small">
              <PropertyField Component={Slider} property="opacity" />
              <PropertyField Component={NumericInput} property="opacity" />

              {/* <Slider
                value={selectedShape ? selectedShape.opacity : 0}
                disabled={!selectedShape}
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSlidingComplete}
              /> */}
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
