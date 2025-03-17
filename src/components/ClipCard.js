import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { formatDuration } from '../utils/formatters.js';

import { format } from 'date-fns';

const ClipCard = ({ clip, onPress, onLongPress, isSelected }) => (
  <TouchableOpacity 
    style={[styles.card, isSelected && styles.selectedCard]} 
    onPress={() => onPress(clip)}
    onLongPress={() => onLongPress(clip)}
    delayLongPress={300}
  >
    <Image source={{ uri: clip.thumbnail_url }} style={styles.thumbnail} />
    {isSelected && (
      <View style={styles.checkmarkOverlay}>
        <Icon name="check-circle" size={30} color="#00AAFF" />
      </View>
    )}
    <View style={styles.durationBadge}>
      <Text style={styles.durationText}>{formatDuration(clip.duration)}</Text>
    </View>
    <Text style={styles.title} numberOfLines={2}>{clip.title}</Text>
    <Text style={styles.channelName}>{clip.channel_name}</Text>
    <View style={styles.metaContainer}>
      <Text style={styles.views}>{clip.views} views</Text>
      <Text style={styles.date}>
        {format(new Date(clip.created_at), 'MMM d, yyyy')}
      </Text>
      <Text style={styles.time}>
        {format(new Date(clip.created_at), 'h:mm a')}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    margin: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    width: '47%',
  },
  thumbnail: {
    width: '100%',
    height: 150,
    backgroundColor: '#121212',
  },
  durationBadge: {
    position: 'absolute',
    right: 8,
    bottom: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
    marginTop: 8,
  },
  channelName: {
    color: '#AAAAAA',
    fontSize: 12,
    marginHorizontal: 8,
    marginTop: 4,
  },
  views: {
    color: '#888888',
    fontSize: 12,
    marginHorizontal: 8,
    marginBottom: 8,
  },
});

export default ClipCard;