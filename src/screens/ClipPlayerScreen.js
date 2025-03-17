import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Share 
} from 'react-native';
import { useDispatch } from 'react-redux';
import VideoPlayer from '../components/VideoPlayer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'react-native-fs';
import { addDownload, startDownload, completeDownload } from '../redux/downloadsSlice';

const ClipPlayerScreen = ({ route }) => {
  const { clip } = route.params;
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const downloadClip = async () => {
    try {
      setDownloading(true);
      dispatch(startDownload(clip.id));
      
      const fileUri = `${FileSystem.DocumentDirectoryPath}/kick_${clip.id}.mp4`;
      
      const downloadOptions = {
        fromUrl: clip.video_url,
        toFile: fileUri,
        progress: (res) => {
          const percentage = Math.round((res.bytesWritten / res.contentLength) * 100);
          setProgress(percentage);
        },
        begin: (res) => {
          console.log('Download started', res);
        },
      };
      
      const result = await FileSystem.downloadFile(downloadOptions).promise;
      
      if (result.statusCode === 200) {
        const downloadInfo = {
          id: clip.id,
          title: clip.title,
          channelName: clip.channel_name,
          thumbnailUrl: clip.thumbnail_url,
          localUri: fileUri,
          dateDownloaded: new Date().toISOString(),
        };
        
        dispatch(addDownload(downloadInfo));
        dispatch(completeDownload(clip.id));
        
        Alert.alert('Success', 'Clip downloaded successfully');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Failed', error.message);
      dispatch(completeDownload(clip.id));
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  const shareClip = async () => {
    try {
      await Share.share({
        message: `Check out this clip: ${clip.title} - ${clip.video_url}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the clip');
    }
  };

  return (
    <View style={styles.container}>
      <VideoPlayer source={clip.video_url} style={styles.videoPlayer} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{clip.title}</Text>
        <Text style={styles.channelName}>by {clip.channel_name}</Text>
        <Text style={styles.stats}>{clip.views} views</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={downloadClip}
          disabled={downloading}
        >
          {downloading ? (
            <View style={styles.downloadProgress}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          ) : (
            <>
              <Icon name="file-download" size={24} color="white" />
              <Text style={styles.actionText}>Download</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={shareClip}>
          <Icon name="share" size={24} color="white" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  videoPlayer: {
    width: '100%',
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  channelName: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    color: '#888888',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginTop: 4,
  },
  downloadProgress: {
    alignItems: 'center',
  },
  progressText: {
    color: 'white',
    marginTop: 4,
  },
});

export default ClipPlayerScreen;