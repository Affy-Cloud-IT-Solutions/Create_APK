import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import passwordIcon from '../src/pass.png';
import passwordVisibleIcon from '../src/open.png';
import passwordHiddenIcon from '../src/close.png';
import backIcon from '../src/back.webp'; 
import { CHANGE_PASSWORD } from '../Config/api';
import ModelScreen from '../Componant/ModelScreen'; 
import successLogo from '../src/check.png'; 
import errorLogo from '../src/reject.png';



const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalLogo, setModalLogo] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                // console.log('Token:', storedToken);
                setToken(storedToken);
            } catch (error) {
                console.error('Error retrieving token', error);
            }
        };

        getToken();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getPasswordVisibilityIcon = () => {
        return showPassword ? passwordVisibleIcon : passwordHiddenIcon;
    };

    const handleChangePassword = async () => {
        console.log('Token in handleChangePassword:', token);
        try {
            const response = await axios.post(CHANGE_PASSWORD, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setModalMessage("Password changed successfully.");
                setModalLogo(successLogo);
                setIsModalVisible(true);
                setTimeout(() => {
                    setIsModalVisible(false);
                    navigation.navigate('Profile'); 
                }, 2000); 
            } else {
                setModalMessage("Failed to change password.");
                setModalLogo(errorLogo);
                setIsModalVisible(true);
                setTimeout(() => {
                    setIsModalVisible(false);
                }, 2000); 
            }
        } catch (error) {
            setModalMessage("Current password not match!.");
            setModalLogo(errorLogo);
            setIsModalVisible(true);
            setTimeout(() => {
                setIsModalVisible(false);
            }, 2000); 
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../src/backimg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Image source={backIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                    <View style={styles.overlay}>
                        <View style={styles.formContainer}>
                            <Text style={styles.welcomeText}>Change Password!</Text>
                            <Text style={styles.welcomeTextPass}>Your password must be at least 6 characters and should include a combination of numbers, letters, and special characters (!@$%).</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Current Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Image source={passwordIcon} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Current Password"
                                        placeholderTextColor="rgba(244,235,208,0.5)"
                                        secureTextEntry={!showPassword}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                    />
                                    <TouchableOpacity onPress={togglePasswordVisibility}>
                                        <Image source={getPasswordVisibilityIcon()} style={styles.icon} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>New Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Image source={passwordIcon} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="New Password"
                                        placeholderTextColor="rgba(244,235,208,0.5)"
                                        secureTextEntry={!showPassword}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                    />
                                    <TouchableOpacity onPress={togglePasswordVisibility}>
                                        <Image source={getPasswordVisibilityIcon()} style={styles.icon} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.signInButton}
                                onPress={handleChangePassword}
                            >
                                <Text style={styles.signInButtonText}>Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>

            <ModelScreen
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                message={modalMessage}
                logo={modalLogo}
            />
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
        justifyContent: 'space-between',
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 10,
        zIndex: 1,
    },
    backIcon: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    overlay: {
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 10,
    },
    welcomeText: {
        color: '#ddd',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    welcomeTextPass: {
        color: '#ddd',
        fontSize: 14,
        marginBottom: 30,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 50,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        marginBottom: 5,
        color: '#ddd',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D6AD60',
        borderRadius: 50,
        paddingHorizontal: 15,
        marginTop: 5,
    },
    input: {
        flex: 1,
        padding: 8,
        fontSize: 16,
        color: '#fff',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: '#D6AD60',
    },
    signInButton: {
        backgroundColor: '#D6AD60',
        width: '70%',
        margin: 'auto',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    signInButtonText: {
        color: 'white',
        fontSize: 15,
    },
});

export default ChangePassword;
