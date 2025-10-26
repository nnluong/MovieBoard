import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import SvgIcon from './SvgIcon';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  isOpen,
  onToggle,
}) => {
  const handleOptionSelect = (value: string) => {
    console.log('Option selected:', value);
    onSelect(value);
    onToggle(); // Close dropdown after selection
  };

  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <Text style={styles.selectedValue}>
          {selectedOption?.label || label}
        </Text>
        <View style={[styles.chevronIcon, isOpen && styles.chevronIconRotated]}>
          <SvgIcon name="chevron-down" size={16} color="#666" />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.optionsContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                selectedValue === option.value && styles.selectedOption,
              ]}
              activeOpacity={0.7}
              onPress={() => handleOptionSelect(option.value)}>
              <Text
                style={[
                  styles.optionText,
                  selectedValue === option.value && styles.selectedOptionText,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 16,
  },
  selectedValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingTop: 8,
    zIndex: 1000,
  },
  option: {
    padding: 12,
    borderBottomColor: '#f0f0f0',
    marginHorizontal: 16,
    backgroundColor: '#F8F8F8',
    marginBottom: 8,
    borderRadius: 3,
  },
  selectedOption: {
    backgroundColor: '#01B4E4',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  chevronIcon: {
    // Animation could be added with Animated API if needed
  },
  chevronIconRotated: {
    transform: [{rotate: '180deg'}],
  },
});

export default Dropdown;
