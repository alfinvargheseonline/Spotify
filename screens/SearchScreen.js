import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import axios from 'axios';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchMusic = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      // Note: OpenWhyd doesn't provide a direct search endpoint
      // So we'll fetch hot tracks and filter client-side
      const response = await axios.get('https://openwhyd.org/hot/electro?format=json');
      
      // Filter tracks based on search query
      const filteredTracks = response.data.tracks.filter(track => 
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.uNm.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(track => ({
        id: track._id,
        title: track.name,
        artist: track.uNm,
        cover: track.img,
        audioUrl: `https:${track.trackUrl}`,
        youtubeId: track.eId.replace('/yt/', '')
      }));

      setSearchResults(filteredTracks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching music', error);
      setIsLoading(false);
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => navigation.navigate('Player', { song: item })}
    >
      <Image source={{ uri: item.cover }} style={styles.resultCover} />
      <View style={styles.resultText}>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultArtist} numberOfLines={1}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for tracks or artists"
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={searchMusic}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery ? "No results found" : "Search for tracks"}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 15,
    paddingTop: 50, // Increased top margin for better alignment
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduced spacing for compact display
    backgroundColor: '#282828',
    borderRadius: 10,
    padding: 10,
  },
  resultCover: {
    width: 50, // Reduced for better mobile compatibility
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  resultText: {
    flex: 1,
  },
  resultTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultArtist: {
    color: 'gray',
    fontSize: 12,
  },
  emptyText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SearchScreen;
