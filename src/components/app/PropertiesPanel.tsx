import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput } from 'react-native-web';

import { Spacer, Slider, List, Form, NumericInput, Field, PropertyField } from '../core';
import Panel from '../shared/Panel';
import Shape from '../../types/Shape';
import Properties from '../../types/Properties';

type PropertiesPanelProps = {
  selectedShapeId: number,
  dispatch: React.Dispatch<any>,
  onShapeUpdate: (shapeId: number, shape: Properties) => void,
};

const PropertiesPanel = ({
  selectedShapeId,
  dispatch,
  onShapeUpdate
}: PropertiesPanelProps) => {
  console.log('PropertiesPanel()', selectedShapeId);

  const handleShapeUpdate = (name: string, value: any) => {
    onShapeUpdate(selectedShapeId, {
      [name]: value,
    });
  };

  const handlePropertyChange = (name: string, value: any) => {
    dispatch({
      type: 'SET_SHAPE_PROPERTY',
      payload: {
        shapeId: selectedShapeId,
        propertyName: name,
        propertyValue: value,
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
            </List>
          </Section>
          <Section title="Rotation">
            <List horizontal spacerSize="small">
              <PropertyField Component={Slider} property="angle" max="36000" />
              <PropertyField Component={NumericInput} property="angle" />
            </List>
          </Section>
          <Section title="Color">
            <List horizontal spacerSize="small">
              <PropertyField Component={Slider} property="hue" max="36000" />
              <PropertyField Component={NumericInput} property="hue" />
            </List>
          </Section>
        </List>
      </Form>
    </Panel>
  );
};

type SectionProps = {
  title: string,
  children: React.ReactNode,
};

const Section = ({ title, children }: SectionProps) => {
  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 12, fontWeight: 700 }}>{title}</Text>
      <Spacer size="small" />
      {children}
    </View>
  );
};

export default React.memo(PropertiesPanel);
