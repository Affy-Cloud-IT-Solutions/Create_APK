import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import emailIcon from '../src/email.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { forgotPassword } from '../Config/services';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from './CustomAlert';
import successIcon from '../src/check.png'; 
import errorIcon from '../src/reject.png';  

const ForgotPass = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertImage, setAlertImage] = useState(null);

    useEffect(() => {
        if (alertVisible) {
            const timer = setTimeout(() => {
                setAlertVisible(false);
                if (alertImage === successIcon) {
                    navigation.navigate('ResetPass');
                }
            }, 2000); 

            return () => clearTimeout(timer); 
        }
    }, [alertVisible]);

    const handleSendPress = async () => {
        setLoading(true);
        try {
            await forgotPassword(email);
            setAlertMessage('Password reset link has been sent to your email.');
            setAlertImage(successIcon);
        } catch (error) {
            setAlertMessage('Failed to send password reset link. Please try again.');
            setAlertImage(errorIcon);
        } finally {
            setLoading(false);
            setAlertVisible(true);
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
                    <View style={styles.overlay}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon name="arrow-left" size={25} color="#D6AD60" />
                        </TouchableOpacity>
                        <View style={styles.topView}>
                            <Image
                                source={require('../src/Brand_logo.png')}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <Image source={emailIcon} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter email here"
                                        placeholderTextColor="rgba(244,235,208,0.5)"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </View>                           

                            <TouchableOpacity style={styles.signInButton} onPress={handleSendPress} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator size="large" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.signInButtonText}>Send</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
            <CustomAlert 
                visible={alertVisible} 
                message={alertMessage} 
                onClose={() => setAlertVisible(false)} 
                imgSrc={alertImage} 
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
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    topView: {
        alignItems: 'center',
        marginBottom: 20,
    },
    formContainer: {
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        marginBottom: 10,
        color: '#D6AD60',
        marginLeft: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D6AD60',
        borderRadius: 50,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        padding: 8,
        fontSize: 16,
        color: '#D6AD60',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: '#D6AD60',
    },
    signInButton: {
        backgroundColor: '#D6AD60',
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    signInButtonText: {
        color: 'white',
        fontSize: 18,
    },
    image: {
        width: 200,
        height: 150,
    },
});

export default ForgotPass;
