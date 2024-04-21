import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, FlatList, Text, TouchableOpacity, Alert, Pressable } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { circle } from "../assets/circle.svg";
import Svg, { Circle } from 'react-native-svg';

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [center, setCenter] = useState({
    latitude: 37.78825,
    longitude: -122.4324
  });
  const [markers, setMarkers] = useState([]); // Use an array to manage multiple markers
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [genMarkers, setGenMarkers] = useState([]);

  // Function to handle map press to add a new marker
  const handleMapPress = (e) => {
    const newMarker = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      key: Math.random().toString() // Unique key for each marker
    };
    setMarkers([...markers, newMarker]);
  };

  // Function to search location using Google Places API
  const searchLocation = async (search) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(search)}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      setResults(json.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const selectLocation = (location) => {
    const {lat, lng} = location.geometry.location;
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    });
  };

  // Function to add a marker
  const addMarker = (location) => {
    const lat = location.latitude;
    const lng = location.longitude;
    const newMarker = {
      latitude: lat,
      longitude: lng,
      key: `s_${Date.now()}` // Different prefix for search-based markers
    }
    console.log(markers);
    setMarkers([...markers, newMarker]);
  }

  // Function to remove a marker
  const removeMarker = (key) => {
    setMarkers(markers.filter(marker => marker.key !== key));
  };

  const handleRegionChange = (newRegion) => {
    const lat = newRegion.latitude;
    const long = newRegion.longitude;
    setCenter({latitude: lat, longitude: long});
  }

  
  // Optional: Alert to confirm removal
  const handleMarkerPress = (marker) => {
    Alert.alert(
      "Remove Marker",
      "Do you want to remove this marker?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => removeMarker(marker.key) }
      ]
    );
  };

  const generateLocations = async () => {
    markers.map(async (marker) => {
      const apiURL = `https://places.googleapis.com/v1/places:searchNearby`;
      console.log(marker.longitude)

      const formData = new FormData();

      formData.append("includedTypes", ["hospital"]);
      formData.append("locationRestriction", {
        "circle": {
          "center": {
            "latitude": marker.latitude,
            "longitude": marker.longitude
          },
          "radius": 10000.0
        }
      });

      const formBody = {
        "includedTypes": [
          "restaurant"
        ],
        "maxResultCount": 10,
        "locationRestriction": {
          "circle": {
            "center": {
              "latitude": 37.7937,
              "longitude": -122.3965
            },
            "radius": 500
          }
        }
      };
      formData.append("maxResultCount", 4);

      try {
        const response = await fetch(apiURL, {
          method: 'POST',
          body: JSON.stringify(formBody),
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': "places.displayName,places.location,places.formattedAddress"
          }
        });
        const data = await response.json();
        console.log(data);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    })
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        onPress={handleMapPress}
        region={region}
        onRegionChange={handleRegionChange}
      >
        {markers.map((marker, index) => (
          <Marker
            centerOffset={{ x: 0, y: 0}}
            key={marker.key}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            onPress={() => handleMarkerPress(marker)}
          >
            <Text style={{opacity: 0}}>''</Text>
            <Svg height={50} width={50}>
              <Circle
                cx={25}
                cy={35}
                r={15}
                fill="rgba(255, 0, 0, 0.5)" // Customize fill color and opacity
              />
            </Svg>
          </Marker>
        ))}

        <Marker 
          style={styles.centerMarker}
          pinColor="#ab39fe"
          coordinate={center}
        />

        {/* {resourceMarkers.map((resourceMarker, index) => {
          <Marker 
            key={index}
          />
        })} */}
      </MapView>
      <TextInput
        style={styles.searchBox}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search for a place"
      />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => addMarker(center)}>
          <Text style={styles.buttonText}>Add Marker</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.searchButton]} title="Search" onPress={() => searchLocation(searchTerm)}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={() => generateLocations(markers)}>
        <Text style={styles.buttonText}>Generate</Text>
      </Pressable>
      {searchTerm && results.length > 0 && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  centerMarker: {
    opacity: 0.5
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
  buttonContainer: {
    display: 'flex',
    width: "100%",
    flexDirection: 'row',
    justifyContent: "space-evenly",
    marginTop: 5
  },
  button: {
    backgroundColor: "#7abbff",
    display: 'flex',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 6
  },
  buttonText: {
    fontSize: 20,
  },
  resultsList: {
    position: 'absolute',
    top: '70%',
    width: '100%',
    height: '30%',
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