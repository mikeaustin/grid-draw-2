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
            <View style={{ alignItems: 'center' }}>
              <PropertyField Component={NumericInput} label="Y" property="position[1]" />
              <Spacer size="small" />
              <List horizontal style={{ width: '100%' }}>
                <PropertyField Component={NumericInput} label="X" property="position[0]" />
                <View style={{ flex: 1 }} />
                <PropertyField Component={NumericInput} label="W" property="position[0]" />
              </List>
              <Spacer size="small" />
              <PropertyField Component={NumericInput} label="H" property="position[1]" />
            </View>
          </Section>
          <Section title="Opacity">
            <List horizontal spacerSize="small">
              <PropertyField Component={Slider} property="opacity" flex />
              <PropertyField Component={NumericInput} property="opacity" />
            </List>
          </Section>
          <Section title="Rotation">
            <List horizontal spacerSize="small">
              <PropertyField Component={Slider} property="angle" max="36000" flex />
              <PropertyField Component={NumericInput} property="angle" />
            </List>
          </Section>
          <Section title="Fill">
            <SliderWithInputPropertyField label="H" property="hue" max="36000" />
            <SliderWithInputPropertyField label="H" property="hue" max="36000" />
          </Section>
        </List>
      </Form>
    </Panel>
  );
};

const SliderWithInputPropertyField = ({ label, property, max }) => {
  return (
    <List horizontal spacerSize="small">
      <PropertyField Component={Slider} label={label} property={property} flex max={max} />
      <PropertyField Component={NumericInput} property={property} />
    </List>
  );
};

type SectionProps = {
  title: string,
  children: React.ReactNode,
};

const Section = ({ title, children }: SectionProps) => {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
      <Text style={{ fontSize: 12, fontWeight: 700 }}>{title}</Text>
      <Spacer size="small" />
      <List spacerSize="small">
        {children}
      </List>
    </View>
  );
};

export default React.memo(PropertiesPanel);
