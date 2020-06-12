/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useCallback, useContext } from 'react';
import { View, Text } from 'react-native-web';
import expr from 'property-expr';

import { Spacer, Slider, List, Form, NumericInput, Field, PropertyField } from '../core';
import Panel from '../shared/Panel';
import Shape from '../../types/Shape';
import Properties from '../../types/Properties';
import { SelectedShapeContext } from '../../AppContext';

const clone = value => {
  if (Array.isArray(value) || value instanceof Int16Array) {
    return value.map(item => clone(item));
  }

  if (typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: clone(value)
    }), {});
  }

  return value;
};

type PropertiesPanelProps = {
  selectedShapeId: number,
  dispatch: React.Dispatch<any>,
};

const PropertiesPanel = ({
  selectedShapeId,
  dispatch,
}: PropertiesPanelProps) => {
  console.log('PropertiesPanel() - selectedShapeId:', selectedShapeId);

  const { onShapeUpdate } = useContext(SelectedShapeContext);

  const handleShapeUpdate = useCallback((propertyName: string, propertyValue: any) => {
    onShapeUpdate(selectedShapeId, {
      [propertyName]: propertyValue,
    });
  }, [selectedShapeId, onShapeUpdate]);

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
              <PropertyField Component={NumericInput} label="Y" property="position.y" />
              <Spacer size="small" />
              <List horizontal style={{ width: '100%' }}>
                <PropertyField Component={NumericInput} label="X" property="position.x" />
                <View style={{ flex: 1 }} />
                <PropertyField Component={NumericInput} label="W" property="size.x" />
              </List>
              <Spacer size="small" />
              <PropertyField Component={NumericInput} label="H" property="size.y" />
            </View>
          </Section>
          <Section title="Opacity">
            <List horizontal spacerSize="small">
              <PropertyField Component={Slider} property="opacity" max="100" scale={100} flex />
              <PropertyField Component={NumericInput} property="opacity" units="%" scale={100} />
            </List>
          </Section>
          <Section title="Rotation">
            <List horizontal spacerSize="small">
              <PropertyField Component={Slider} property="angle" max="36000" flex />
              <PropertyField Component={NumericInput} property="angle" units="°d" />
            </List>
          </Section>
          <Section title="Fill">
            <SliderWithInputPropertyField label="H" property="fill.hue" units="°d" max="36000" />
            <SliderWithInputPropertyField label="S" property="fill.saturation" units="%" max="10000" />
            <SliderWithInputPropertyField label="L" property="fill.lightness" units="%" max="10000" />
          </Section>
          <Section title="Corner Radius">
            <SliderWithInputPropertyField label={undefined} property="cornerRadius" max="10000" />
          </Section>
        </List>
      </Form>
    </Panel>
  );
};

type SliderWithInputPropertyFieldProps = {
  label?: string,
  property: string,
  [prop: string]: any,
};

const SliderWithInputPropertyField = React.memo(({
  label,
  property,
  ...props
}: SliderWithInputPropertyFieldProps) => {
  console.log('SliderWithInputPropertyField()');

  return (
    <List horizontal spacerSize="small">
      <PropertyField Component={Slider} label={label} property={property} flex {...props} />
      <PropertyField Component={NumericInput} property={property} {...props} />
    </List>
  );
});

type SectionProps = {
  title: string,
  children: React.ReactNode,
};

const Section = React.memo(({ title, children }: SectionProps) => {
  return (
    <View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
      <Text style={{ fontSize: 12, fontWeight: 700 }}>{title}</Text>
      <Spacer size="small" />
      <List spacerSize="small">
        {children}
      </List>
    </View>
  );
});

export default React.memo(PropertiesPanel);
