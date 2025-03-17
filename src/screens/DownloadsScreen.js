import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeDownload } from '../redux/downloadsSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DownloadsScreen = ({ navigation }) => {
  const { items, inProgress } = useSelector(state => state.downloads);
  const dispatch = useDispatch();

  const handlePlayDownload = (item) => {
    navigation.navigate('ClipPlayer', { 
      clip: {
        ...item,
        video_url: item.localUri
      }
    });
  };

  const handleDeleteDownload = (id) => {
    // In a full implementation, you'd also delete the file
    dispatch(removeDownload(id));
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="download" size={64} color="#555" />
        <Text style={styles.emptyText}>No downloaded clips</Text>
        <Text style={styles.emptySubtext}>
          Downloaded clips will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Downloads</Text>
      
      <FlatList
        data={items}
        keyExtractor={item => `download-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.downloadItem}>
            <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
            
            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.channelName}>{item.channelName}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handlePlayDownload(item)}
              >
                <Icon name="play-arrow" size={24} color="#00AAFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeleteDownload(item.id)}
              >
                <Icon name="delete" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  downloadItem: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 100,
    height: 70,
    backgroundColor: '#0A0A0A',
  },
  infoContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  channelName: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    marginHorizontal: 40,
  },
});

export default DownloadsScreen;