import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://openwhyd.org/hot/electro?format=json');
      
      // Transform the API data to match our app's expected structure
      const formattedTracks = response.data.tracks.map(track => ({
        id: track._id,
        title: track.name,
        artist: track.uNm, // User name as artist
        cover: track.img,
        audioUrl: `https:${track.trackUrl}`,
        youtubeId: track.eId.replace('/yt/', '')
      }));

      setTracks(formattedTracks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tracks', error);
      setIsLoading(false);
    }
  };

  const renderTrack = ({ item }) => (
    <TouchableOpacity 
      style={styles.trackItem}
      onPress={() => navigation.navigate('Player', { song: item })}
    >
      <Image source={{ uri: item.cover }} style={styles.trackCover} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Hot Electro Tracks</Text>
      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.trackList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  trackList: {
    paddingHorizontal: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  trackCover: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
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
    fontSize: 14,
  },
});

export default HomeScreen;