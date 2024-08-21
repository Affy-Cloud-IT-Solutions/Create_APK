import React, { useRef, useEffect } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Text,
  SafeAreaView, 
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import logo from "../src/secondary_logo.png";

const SplashScreen = () => {
  const navigation = useNavigation(); 

  const scaleValue = useRef(new Animated.Value(0.3)).current; 
  const text1Position = useRef(new Animated.Value(-500)).current; 
  const text2Position = useRef(new Animated.Value(500)).current; 

  useEffect(() => {

    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 2000, 
        useNativeDriver: true, 
      }).start(),
      Animated.timing(text1Position, {
        toValue: 0, 
        duration: 2000, 
        useNativeDriver: true, 
      }).start(),
      Animated.timing(text2Position, {
        toValue: 0, 
        duration: 2500, 
        useNativeDriver: true, 
      }).start(),
    ]);

    const timer = setTimeout(() => {
      navigation.replace('Login');  
    }, 3000);

    return () => clearTimeout(timer);
  }, [scaleValue, text1Position, text2Position, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.Image
          source={logo}
          style={[
            styles.image,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        />
        <Animated.Text
          style={[
            styles.text1,
            {
              transform: [{ translateX: text1Position }],
            },
          ]}
        >
          Eleganza Estate Solution
        </Animated.Text>
        <Animated.Text
          style={[
            styles.text2,
            {
              transform: [{ translateX: text2Position }],
            },
          ]}
        >
          Timeless eleganza, timeless investment
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#122620", 
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 200,
  },
  text1: {
    fontSize: 24,
    color: "#D6AD60",
    textAlign: "center",
  },
  text2: {
    fontSize: 12,
    color: "#D6AD60",
    textAlign: "center",
  },
});

export default SplashScreen;
