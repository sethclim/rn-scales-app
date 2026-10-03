import React, { useContext, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, useWindowDimensions, View, StyleSheet } from "react-native";

import { GraphView } from './Graph/Graph';
import { GRAPH_FIXTURES } from './Graph/fixtures';
import { ThemeContext } from '../../context/ThemeContext';

// Dev-only screen for eyeballing the graph against sample datasets

const Padding = 10;

type Size = { label: string, width: number, height: number };

const getSizes = (width: number, height: number): Size[] => [
  // Same size as PracticeStats
  { label: 'Phone', width: width - Padding * 2, height: height * 0.5 - 50 },
  { label: 'Tall', width: width - Padding * 2, height: height * 0.75 },
  { label: 'Narrow', width: 280, height: height * 0.5 - 50 },
  { label: 'Small', width: 300, height: 220 },
];

type ChipsProps = {
  options: string[],
  selected: string,
  onSelect: (option: string) => void,
  color: string,
}

const Chips = ({ options, selected, onSelect, color }: ChipsProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
    {options.map(option => (
      <TouchableOpacity
        key={option}
        onPress={() => onSelect(option)}
        style={[styles.chip, { borderColor: color }, option === selected && { backgroundColor: color }]}
      >
        <Text style={{ color: option === selected ? 'black' : color }}>{option}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const GraphPlayground = () => {
  const { width, height } = useWindowDimensions();
  const { primary, background } = useContext(ThemeContext);

  const fixtureNames = Object.keys(GRAPH_FIXTURES);
  const sizes = getSizes(width, height);

  const [fixture, setFixture] = useState(fixtureNames[0]);
  const [sizeLabel, setSizeLabel] = useState(sizes[0].label);
  const size = sizes.find(s => s.label === sizeLabel)!;

  return (
    <ScrollView style={{ backgroundColor: background! }} contentContainerStyle={{ padding: Padding }}>
      <Chips options={fixtureNames} selected={fixture} onSelect={setFixture} color={primary!} />
      <Chips options={sizes.map(s => s.label)} selected={sizeLabel} onSelect={setSizeLabel} color={primary!} />
      <View style={styles.graph}>
        {/* Remount per fixture so every derived value starts fresh */}
        <GraphView
          key={`${fixture}-${sizeLabel}`}
          width={size.width}
          height={size.height}
          data={GRAPH_FIXTURES[fixture]}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chips: {
    flexGrow: 0,
    marginBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  graph: {
    marginTop: 8,
  },
});

export default GraphPlayground;
