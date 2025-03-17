import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';


const VideoPlayer = ({ source, style }) => {
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  // useEffect here
  useEffect(() => {
    return () => {
      // Reset to portrait when component unmounts
      Orientation.lockToPortrait();
    };
  }, []);

  const onLoad = (data) => {
    setDuration(data.duration);
    setLoading(false);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    setIsFullscreen(!isFullscreen);
  };
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={toggleControls}
      >
        <Video
          ref={videoRef}
          source={{ uri: source }}
          style={styles.video}
          resizeMode="contain"
          paused={paused}
          onLoad={onLoad}
          onProgress={onProgress}
        />
        
        {loading && (
          <ActivityIndicator size="large" color="white" style={styles.loader} />
        )}
        
        {showControls && (
  <View style={styles.controls}>
    <TouchableOpacity onPress={togglePlayPause}>
      <Icon
        name={paused ? 'play-arrow' : 'pause'}
        size={40}
        color="white"
      />
    </TouchableOpacity>
    
    {/* Add this fullscreen button */}
    <TouchableOpacity 
      style={styles.fullscreenButton} 
      onPress={toggleFullscreen}
    >
      <Icon
        name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
        size={30}
        color="white"
      />
    </TouchableOpacity>
  </View>
)}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '100%',
    aspectRatio: 16 / 9,
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    position: 'absolute',
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullscreenButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  
  //
  //  update the controls style to support proper positioning
  controls: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;