import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

// Mock data for music suggestions
const mockSuggestions = [
  { 
    id: '1', 
    title: 'Summer Vibes', 
    artist: 'Chill Tracks', 
    youtubeId: 'dQw4w9WgXcQ',
    artwork: 'https://example.com/artwork1.jpg'
  },
  { 
    id: '2', 
    title: 'Acoustic Morning', 
    artist: 'Calm Sounds', 
    youtubeId: 'abc123',
    artwork: 'https://example.com/artwork2.jpg'
  },
  { 
    id: '3', 
    title: 'Electric Nights', 
    artist: 'Urban Beats', 
    youtubeId: 'xyz789',
    artwork: 'https://example.com/artwork3.jpg'
  },
  { 
    id: '4', 
    title: 'Smooth Jazz', 
    artist: 'Relaxation Ensemble', 
    youtubeId: 'def456',
    artwork: 'https://example.com/artwork4.jpg'
  }
];

const MusicSuggestionItem = ({ item, onSelect }) => (
  <TouchableOpacity 
    style={styles.suggestionItem} 
    onPress={() => onSelect(item)}
  >
    <Image 
      source={{ uri: item.artwork }} 
      style={styles.suggestionArtwork} 
    />
    <View style={styles.suggestionTextContainer}>
      <Text style={styles.suggestionTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.suggestionArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </View>
  </TouchableOpacity>
);

const PlayerScreen = ({ route, navigation }) => {
  const { song } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(song);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const webViewRef = useRef(null);

  // YouTube embedded player HTML
  const getPlayerHTML = (videoId) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <style>
          body { margin: 0; background-color: black; }
          iframe { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&showinfo=0" 
          frameborder="0" 
          allow="autoplay; encrypted-media"
        ></iframe>
        <script>
          function playPause() {
            const iframe = document.querySelector('iframe');
            const player = iframe.contentWindow;
            player.postMessage('{"event":"command","func":"playPause","args":""}', '*');
          }
        </script>
      </body>
    </html>
  `;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    webViewRef.current?.injectJavaScript('playPause()');
  };

  const handleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
    // Implement shuffle logic here
  };

  const handleRepeat = () => {
    setIsRepeatOn(!isRepeatOn);
    // Implement repeat logic here
  };

  const handlePreviousSong = () => {
    // Implement previous song logic
    console.log('Previous song');
  };

  const handleNextSong = () => {
    // Implement next song logic
    console.log('Next song');
  };

  const handleSuggestionSelect = (selectedSong) => {
    // Update current song and reset player
    setCurrentSong(selectedSong);
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.playerContainer}>
        <WebView
          ref={webViewRef}
          style={styles.webview}
          source={{ html: getPlayerHTML(currentSong.youtubeId) }}
          allowsFullscreenVideo={false}
          mediaPlaybackRequiresUserAction={false}
        />
      </View>

      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{currentSong.artist}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleShuffle}>
          <Ionicons 
            name="shuffle" 
            size={30} 
            color={isShuffleOn ? '#1DB954' : 'white'} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePreviousSong}>
          <Ionicons name="play-back" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons 
            name={isPlaying ? "pause-circle" : "play-circle"} 
            size={70} 
            color="white" 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextSong}>
          <Ionicons name="play-forward" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRepeat}>
          <Ionicons 
            name="repeat" 
            size={30} 
            color={isRepeatOn ? '#1DB954' : 'white'} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Music Suggestions</Text>
        <FlatList
          data={mockSuggestions}
          renderItem={({ item }) => (
            <MusicSuggestionItem 
              item={item} 
              onSelect={handleSuggestionSelect} 
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  playerContainer: {
    height: Dimensions.get('window').width * 0.5,
    width: '90%',
    marginTop: 100,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  songInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  songTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  artistName: {
    color: 'gray',
    fontSize: 18,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  suggestionsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  suggestionsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestionItem: {
    marginRight: 15,
    width: 120,
  },
  suggestionArtwork: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  suggestionTextContainer: {
    marginTop: 5,
  },
  suggestionTitle: {
    color: 'white',
    fontSize: 14,
  },
  suggestionArtist: {
    color: 'gray',
    fontSize: 12,
  },
});

export default PlayerScreen;