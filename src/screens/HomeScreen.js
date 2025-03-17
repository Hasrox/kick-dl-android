import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../components/SearchBar';
import SearchFilterDialog from '../components/SearchFilterDialog'; // Add this import
import { setChannel } from '../redux/clipsSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [recentChannels, setRecentChannels] = useState([]);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false); // Add this
  const [searchQuery, setSearchQuery] = useState(''); // Add this
  const dispatch = useDispatch();

  useEffect(() => {
    loadRecentChannels();
  }, []);

  const loadRecentChannels = async () => {
    try {
      const storedChannels = await AsyncStorage.getItem('recentChannels');
      if (storedChannels) {
        setRecentChannels(JSON.parse(storedChannels));
      }
    } catch (error) {
      console.error('Failed to load recent channels:', error);
    }
  };

  // Modified to show filter dialog instead of searching immediately
  const handleSearch = (channelName) => {
    setSearchQuery(channelName);
    setFilterDialogVisible(true);
  };

  // New function that will be called after filter selection
  const handleSearchWithFilters = async (channelName, sortBy, timeFilter) => {
    dispatch(setChannel(channelName));
    
    // Save to recent channels
    const updated = [channelName, ...recentChannels.filter(c => c !== channelName)].slice(0, 5);
    setRecentChannels(updated);
    
    try {
      await AsyncStorage.setItem('recentChannels', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent channel:', error);
    }
    
    // Close dialog
    setFilterDialogVisible(false);
    
    // Navigate with the filter parameters
    navigation.navigate('ClipsList', { 
      channelName,
      sortBy,
      timeFilter
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kick Clips</Text>
      <SearchBar onSearch={handleSearch} />
      
      {/* Filter Dialog */}
      <SearchFilterDialog
        visible={filterDialogVisible}
        channelName={searchQuery}
        onClose={() => setFilterDialogVisible(false)}
        onApply={handleSearchWithFilters}
      />
      
      <Text style={styles.sectionTitle}>Recent Channels</Text>
      {recentChannels.length > 0 ? (
        <FlatList
          data={recentChannels}
          keyExtractor={(item, index) => `recent-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.channelItem}
              onPress={() => handleSearch(item)}
            >
              <Icon name="history" size={24} color="#888" />
              <Text style={styles.channelName}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>
          No recent channels. Search for a channel to get started.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
  },
  channelName: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 40,
  },
});

export default HomeScreen;