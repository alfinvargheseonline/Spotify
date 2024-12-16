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

const LibraryScreen = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists();
    fetchLikedSongs();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('https://openwhyd.org/hot/electro?format=json');
      const playlistsData = response.data.tracks
        .filter(track => track.pl && track.pl.id)  // Ensure `pl` and `id` are present
        .map(track => ({
          id: track.pl.id,
          name: track.pl.name,
          cover: track.img,
          trackCount: track.nbR, // or another appropriate field for the number of tracks
        }));
      setPlaylists(playlistsData); // Setting playlists data
    } catch (error) {
      console.error('Error fetching playlists', error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  };
  
  const fetchLikedSongs = async () => {
    try {
      const response = await axios.get('https://openwhyd.org/hot/electro?format=json');
      const likedSongsData = response.data.tracks.map(track => ({
        id: track._id,
        title: track.name,
        artist: track.uNm, // Assuming the artist's name is in 'uNm'
        cover: track.img,
        trackUrl: track.trackUrl, // You might want to use this URL to open the song
      }));
      setLikedSongs(likedSongsData); // Setting liked songs data
    } catch (error) {
      console.error('Error fetching liked songs', error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  };
  const renderPlaylist = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.playlistItem}
      onPress={() => navigation.navigate('AlbumDetail', { playlist: item })}
    >
      <Image source={{ uri: item.cover }} style={styles.playlistCover} />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistTracks}>{item.trackCount} Tracks</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderLikedSong = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.songItem}
      onPress={() => navigation.navigate('Player', { song: item })}
    >
      <Image source={{ uri: item.cover }} style={styles.songCover} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Playlists</Text>
      <FlatList
        horizontal
        data={playlists}
        renderItem={renderPlaylist}
        keyExtractor={(item, index) => `playlist-${item.id}-${index}`} // Combine id and index for uniqueness
      />
  
      <Text style={styles.sectionTitle}>Liked Songs</Text>
      <FlatList
        data={likedSongs}
        renderItem={renderLikedSong}
        keyExtractor={(item, index) => `likedSong-${item.id}-${index}`} // Combine id and index for uniqueness
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
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  playlistItem: {
    marginRight: 15,
    width: 200,
  },
  playlistCover: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  playlistInfo: {
    marginTop: 10,
  },
  playlistName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playlistTracks: {
    color: 'gray',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  songCover: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 5,
  },
  songTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  songArtist: {
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
  },
});

export default LibraryScreen;
