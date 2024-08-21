import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [signInClicked, setSignInClicked] = useState(false);
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSignIn = () => {
    setSignInClicked(true);
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    setSignUpClicked(true);
    navigation.navigate('SignUp');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../src/backimg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.overlay}>
            <View style={styles.topView}>
              <Image
                source={require('../src/Brand_logo.png')}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.centerView}>
              <Image
                source={require('../src/Group.png')}
                style={styles.image1}
                resizeMode="contain"
              />
            </View>
            <View style={styles.bottomView}>
              <TouchableOpacity
                style={[styles.button, signInClicked && styles.clickedButton]}
                onPress={handleSignIn}
              >
                <Text style={[styles.buttonText, signInClicked]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, signUpClicked && styles.clickedButton]}
                onPress={handleSignUp}
              >
                <Text style={[styles.buttonText, signUpClicked]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 10,
  },
  topView: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  image: {
    width: '100%',
    height: 120,
  },
  image1: {
    width: '90%',
    height: '100%',
  },
  button: {
    backgroundColor: '#D6AD60',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  buttonText: {
    color: '#F4EBD0',
    fontSize: 18,
  },
  clickedButton: {
    backgroundColor: 'transparent',
    borderColor: '#F4EBD0',
  },
  clickedButtonText: {
    color: '#F4EBD0',
    borderColor: '#fff',
  },
});

export default Login;
