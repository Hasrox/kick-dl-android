import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChannelClips } from '../redux/clipsSlice';
import { addDownload } from '../redux/downloadsSlice';
import ClipCard from '../components/ClipCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Simple debounce function to prevent multiple calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const ClipsListScreen = ({ route, navigation }) => {
  const { channelName } = route.params;
  const dispatch = useDispatch();
  const { items, loading, hasMore, error, cursor } = useSelector(state => state.clips);
  const [selectedClips, setSelectedClips] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const totalClips = items.length;

  useEffect(() => {
    loadClips();
  }, [channelName]);

  const loadClips = () => {
    const { channelName, sortBy = 'view', timeFilter = 'all' } = route.params;
    dispatch(fetchChannelClips({ 
      channelName, 
      cursor: null, // Start from the beginning
      sortBy,
      timeFilter
    }));
  };
  
  const loadMoreClips = () => {
    if (!loading && hasMore) {
      console.log(`Loading more clips with cursor: ${cursor}`);
      const { channelName, sortBy = 'view', timeFilter = 'all' } = route.params;
      dispatch(fetchChannelClips({ 
        channelName, 
        cursor,
        sortBy,
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

  const selectAll = () => {
    setSelectedClips(items.map(clip => clip.id));
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedClips([]);
  };

  const downloadSelected = () => {
    if (selectedClips.length === 0) {
      Alert.alert('No Clips Selected', 'Please select at least one clip to download.');
      return;
    }

    Alert.alert(
      'Download Clips',
      `Do you want to download ${selectedClips.length} selected clip(s)?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Download',
          onPress: () => {
            // Find the selected clips from the items array
            const clipsToDownload = items.filter(clip => selectedClips.includes(clip.id));
            
            // Add each clip to downloads
            clipsToDownload.forEach(clip => {
              dispatch(addDownload({
                id: clip.id,
                title: clip.title,
                channelName: clip.channel_name,
                thumbnailUrl: clip.thumbnail_url,
                videoUrl: clip.video_url,
                duration: clip.duration
              }));
            });
            
            // Show success message
            Alert.alert(
              'Download Started',
              `${selectedClips.length} clip(s) added to downloads.`,
              [{ text: 'OK' }]
            );
            
            // Exit selection mode
            exitSelectionMode();
          }
        }
      ]
    );
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
      {selectionMode ? (
        <View style={styles.selectionHeader}>
          <TouchableOpacity style={styles.headerButton} onPress={exitSelectionMode}>
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerText}>
            {selectedClips.length} selected
          </Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={selectAll}>
              <Icon name="select-all" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerButton} onPress={downloadSelected}>
              <Icon name="file-download" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{channelName}'s Clips</Text>
          <Text style={styles.clipCountText}>({totalClips} clips)</Text>
        </View>
      )}
      
      <FlatList
        data={items}
        keyExtractor={item => `clip-${item.id}`}
        renderItem={({ item }) => (
          <ClipCard 
            clip={item} 
            onPress={() => handleClipPress(item)} 
            onLongPress={() => handleLongPress(item)}
            isSelected={selectedClips.includes(item.id)}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.clipsList}
        onEndReached={debounce(loadMoreClips, 300)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading && items.length === 0 ? null : (
            <Text style={styles.emptyText}>No clips found</Text>
          )
        }
        ListFooterComponent={
          <>
            {loading && (
              <ActivityIndicator size="large" color="#00AAFF" style={styles.loader} />
            )}
            {!hasMore && items.length > 0 && (
              <Text style={styles.endText}>No more clips</Text>
            )}
          </>
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
  endText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  clipCountText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginLeft: 8,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E1E1E',
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  }
});

export default ClipsListScreen;
