import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
        <Icon
          name={isOpen ? 'expand-less' : 'expand-more'}
          size={24}
          color="#666"
        />
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
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
});

export default Dropdown;
