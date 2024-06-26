import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect } from 'react';

const Home = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }
    ).start()
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#9c437f', '#110011']}
        style={styles.gradient}
      >
        <Animated.Text style={[styles.text, {
          opacity: fadeAnim
        }]}>
          Travel Buddy
        </Animated.Text>

        <Button title="Let's Get Traveling!"
          onPress={() => navigation.navigate('MainApp')} 
        />

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 50,

  }
});


export default Home;