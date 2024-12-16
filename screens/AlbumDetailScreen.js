import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AlbumDetailScreen = ({ route, navigation }) => {
  // This could be an album or a playlist
  const { album } = route.params;

  // Mock track data - replace with actual API call
  const tracks = [
    { 
      id: '1', 
      title: 'Track 1', 
      artist: 'Artist 1', 
      duration: '3:45' 
    },
    { 
      id: '2', 
      title: 'Track 2', 
      artist: 'Artist 1', 
      duration: '4:12' 
    },
    { 
      id: '3', 
      title: 'Track 3', 
      artist: 'Artist 1', 
      duration: '3:30' 
    },
  ];

  const renderTrack = ({ item }) => (
    <TouchableOpacity 
      style={styles.trackItem}
      onPress={() => navigation.navigate('Player', { song: item })}
    >
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>{item.artist}</Text>
      </View>
      <Text style={styles.trackDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.albumHeader}>
        <Image 
          source={{ uri: album.cover || 'https://example.com/default-album.jpg' }} 
          style={styles.albumCover} 
        />
        <Text style={styles.albumTitle}>{album.title}</Text>
        <Text style={styles.albumArtist}>{album.artist}</Text>
      </View>

      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <TouchableOpacity style={styles.playAllButton}>
            <Ionicons name="play-circle" size={50} color="green" />
            <Text style={styles.playAllText}>Play All</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  albumHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  albumCover: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  albumTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  albumArtist: {
    color: 'gray',
    fontSize: 16,
    marginBottom: 20,
  },
  playAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  playAllText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: 'gray',
  },
  trackDuration: {
    color: 'gray',
  },
});

export default AlbumDetailScreen;