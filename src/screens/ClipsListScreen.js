import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannelClips } from '../redux/clipsSlice';
import ClipCard from '../components/ClipCard';

const ClipsListScreen = ({ route, navigation }) => {
  const { channelName } = route.params;
  const dispatch = useDispatch();
  const { items, loading, hasMore, error, cursor } = useSelector(state => state.clips);

  useEffect(() => {
    loadClips();
  }, [channelName]);

  const loadClips = () => {
    const { channelName, sortBy = 'date', timeFilter = 'all' } = route.params;
    dispatch(fetchChannelClips({ 
      channelName, 
      cursor: 0,
      sortBy,
      timeFilter
    }));
  };
  const loadMoreClips = () => {
    if (!loading && hasMore) {
      const { channelName, sortBy = 'date', timeFilter = 'all' } = route.params;
      dispatch(fetchChannelClips({ 
        channelName, 
        cursor,
        sortBy,
        timeFilter
      }));
    }
  };

  const handleClipPress = (clip) => {
    navigation.navigate('ClipPlayer', { clip });
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
      
      <FlatList
        data={items}
        keyExtractor={item => `clip-${item.id}`}
        renderItem={({ item }) => (
          <ClipCard clip={item} onPress={handleClipPress} />
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


const [selectedClips, setSelectedClips] = useState([]);
const [selectionMode, setSelectionMode] = useState(false);

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

const selectAll = () => {
  setSelectedClips(items.map(clip => clip.id));
};

const downloadSelected = async () => {
  // Implementation for batch downloading selected clips
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