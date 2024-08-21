import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Keyboard } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';

const BottomNavbar = () => {
  const navigation = useNavigation();
  
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Hide the navbar when the keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Show the navbar when the keyboard is hidden
      }
    );

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // If the keyboard is visible, do not render the navbar
  if (isKeyboardVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
        <Icon name="home" size={20} style={styles.icon} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Saved')}>
        <Icon name="bookmark" size={20} style={styles.icon} />
        <Text style={styles.navText}>Saved</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
        <Icon name="user" size={20} style={styles.icon} />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    paddingHorizontal: 10,
    borderColor: "aliceblue",
  },
  navItem: {
    alignItems: "center",
  },
  icon: {
    color: "#555",
  },
  navText: {
    fontSize: 12,
    color: "#555",
  },
});
