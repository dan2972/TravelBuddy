import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  // Function to handle map press to update the marker position manually
  const handleMapPress = (e) => {
    setMarker({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude
    });
  };

  // Function to search location using Google Places API
  const searchLocation = async (search) => {
    const apiKey = process.env.EXPO_PUBLIC_MAPS_API_KEY; // Replace with your actual API key
    console.log(apiKey);
    const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      console.log(json);
      if (json.results.length > 0) {
        setResults(json.results);
      } else {
        console.warn('No results found');
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const selectLocation = (location) => {
    const { lat, lng } = location.geometry.location;
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={region}
      >
         <Marker coordinate={region} />
      </MapView>
      <TextInput
        style={styles.searchBox}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search for a place"
      />
      <Button title="Search" onPress={() => searchLocation(searchTerm)} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => selectLocation(item)}>
            <Text style={styles.itemText}>{item.name} - {item.formatted_address}</Text>
          </TouchableOpacity>
        )}
        style={styles.resultsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '60%', // Adjust the map height to accommodate the list
  },
  searchBox: {
    position: 'absolute',
    marginTop: 40,
    width: '90%',
    alignSelf: 'center',
    height: 40,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  resultsList: {
    position: 'absolute',
    top: '70%', // Adjust as needed
    width: '100%',
    height: '30%', // Define how much space the list should take
  },
  listItem: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default Map;
