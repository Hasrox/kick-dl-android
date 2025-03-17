import React from 'react';
import { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannelClips } from '../redux/clipsSlice';
import ClipCard from '../components/ClipCard';

const ClipsListScreen = ({ route, navigation }) => {
  const { channelName } = route.params;
  const dispatch = useDispatch();
  const { items, loading, hasMore, error, cursor } = useSelector(state => state.clips);
  const [selectedClips, setSelectedClips] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  // Add state for sort option
  const [sortOption, setSortOption] = useState('date'); // 'date' or 'views'

  useEffect(() => {
    loadClips();
  }, [channelName]);

  const loadClips = () => {
    const { channelName, timeFilter = 'all' } = route.params;
    dispatch(fetchChannelClips({ 
      channelName, 
      cursor: 0,
      timeFilter
    }));
  };

  const loadMoreClips = () => {
    if (!loading && hasMore) {
      const { channelName, timeFilter = 'all' } = route.params;
      dispatch(fetchChannelClips({ 
        channelName, 
        cursor,
        timeFilter
      }));
    }
  };

  const handleLongPress = (clip) => {
    setSelectionMode(true);
    setSelectedClips([clip.id]);
  };

  const handleClipPress = (clip) => {
    if (selectionMode) {
      // Toggle selection
      setSelectedClips(prev => 
        prev.includes(clip.id) 
          ? prev.filter(id => id !== clip.id)
          : [...prev, clip.id]
      );
    } else {
      // Normal navigation
      navigation.navigate('ClipPlayer', { clip });
    }
  };

  // Sort the clips based on the selected sort option
  const getSortedClips = () => {
    if (!items || items.length === 0) return [];
    
    return [...items].sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return b.views - a.views;
      }
    });
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadClips}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{channelName}'s Clips</Text>
      
      {/* Add sort options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity 
            style={styles.radioOption} 
            onPress={() => setSortOption('date')}
          >
            <View style={styles.radioButton}>
              {sortOption === 'date' && <View style={styles.radioButtonSelected} />}
            </View>
            <Text style={styles.radioText}>Most Recent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.radioOption} 
            onPress={() => setSortOption('views')}
          >
            <View style={styles.radioButton}>
              {sortOption === 'views' && <View style={styles.radioButtonSelected} />}
            </View>
            <Text style={styles.radioText}>Most Viewed</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={getSortedClips()}
        keyExtractor={item => `clip-${item.id}`}
        renderItem={({ item }) => (
          <ClipCard 
            clip={item} 
            onPress={() => handleClipPress(item)}
            onLongPress={() => handleLongPress(item)}
            selected={selectedClips.includes(item.id)}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.clipsList}
        onEndReached={loadMoreClips}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.emptyText}>No clips found</Text>
          )
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color="#00AAFF" style={styles.loader} />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sortContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00AAFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#00AAFF',
  },
  radioText: {
    color: 'white',
    fontSize: 14,
  },
  clipsList: {
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#00AAFF',
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
});

export default ClipsListScreen;
