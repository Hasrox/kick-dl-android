import React from 'react';
import { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';

const SearchFilterDialog = ({ visible, onClose, onApply, channelName }) => {
  const [timeFilter, setTimeFilter] = useState('all');
  
  const handleApply = () => {
    // We're no longer passing sortBy since it's handled client-side
    onApply(channelName, timeFilter);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.dialogTitle}>Clips from {channelName}</Text>
          
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.option, timeFilter === 'all' && styles.selectedOption]} 
              onPress={() => setTimeFilter('all')}
            >
              <Text style={[styles.optionText, timeFilter === 'all' && styles.selectedText]}>All Time</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, timeFilter === 'month' && styles.selectedOption]} 
              onPress={() => setTimeFilter('month')}
            >
              <Text style={[styles.optionText, timeFilter === 'month' && styles.selectedText]}>Last Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, timeFilter === 'week' && styles.selectedOption]} 
              onPress={() => setTimeFilter('week')}
            >
              <Text style={[styles.optionText, timeFilter === 'week' && styles.selectedText]}>Last Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, timeFilter === 'day' && styles.selectedOption]} 
              onPress={() => setTimeFilter('day')}
            >
              <Text style={[styles.optionText, timeFilter === 'day' && styles.selectedText]}>Last Day</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={styles.buttonCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonApply} onPress={handleApply}>
              <Text style={styles.buttonApplyText}>Fetch Clips</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  dialogContainer: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  option: {
    backgroundColor: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#00AAFF',
  },
  optionText: {
    color: 'white',
  },
  selectedText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  buttonCancel: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  buttonCancelText: {
    color: 'white',
  },
  buttonApply: {
    backgroundColor: '#00AAFF',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonApplyText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchFilterDialog;
