import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView, Text, Image, TextInput, TouchableOpacity, ScrollView, BackHandler, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginService } from '../Config/services';
import emailIcon from '../src/email.png';
import passwordIcon from '../src/pass.png';
import passwordVisibleIcon from '../src/open.png';
import passwordHiddenIcon from '../src/close.png';
import ModelScreen from '../Componant/ModelScreen';
import checkIcon from '../src/check.png'; 
import errorIcon from '../src/reject.png'; 

const SignIn = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalLogo, setModalLogo] = useState(null);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

    const handleSignIn = async () => {
        if (!isTermsAccepted) {
            setModalMessage('You must accept the terms and conditions to proceed.');
            setModalLogo(errorIcon);
            setIsModalVisible(true);
            setTimeout(() => setIsModalVisible(false), 2000);
            return;
        }
    
        setEmailError('');
        setPasswordError('');
        setIsLoading(true);
    
        try {
            const userData = await loginService(email, password);
            console.log('Login response:', userData);
            // console.log("role", userData.meta.role)
    
            if (userData.meta.token) {
                await AsyncStorage.setItem('userToken', userData.meta.token);
                await AsyncStorage.setItem('userId', userData.meta.user._id);
                const verifyEmail = userData.meta.user.verified;
                const userRole = userData.meta.role;
    
                if (!userData.error) {
                    setModalMessage('Login Successful!');
                    setModalLogo(checkIcon);
                    setIsModalVisible(true);
                    setTimeout(() => {
                        setIsModalVisible(false);
                        if (verifyEmail) {
                            if (userRole === 'admin') {
                                navigation.navigate('AdminDashboard');
                            }else if (userRole === 'employee') {
                                navigation.navigate('EmployeeDash');
                            }
                             else {
                                navigation.navigate('Dashboard');
                            }
                        } else {
                            navigation.navigate('otpvarify', { email });
                        }
                    }, 2000);
                }
            }
        } catch (error) {
            setModalMessage('Login Failed');
            setModalLogo(errorIcon);
            setIsModalVisible(true);
            setTimeout(() => setIsModalVisible(false), 2000);
    
            if (error.message.includes('email')) {
                setEmailError('Incorrect email');
            } else if (error.message.includes('password')) {
                setPasswordError('Incorrect password');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getPasswordVisibilityIcon = () => {
        return showPassword ? passwordVisibleIcon : passwordHiddenIcon;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ModelScreen
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                message={modalMessage}
                logo={modalLogo}
            />
            <ImageBackground
                source={require('../src/backimg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.overlay}>
                        <View style={styles.topView}>
                            <Image
                                source={require('../src/Brand_logo.png')}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <Text style={styles.welcomeText}>Welcome !</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <Image source={emailIcon} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Example@gmail.com"
                                        placeholderTextColor="rgba(244,235,208,0.5)"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Image source={passwordIcon} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="*******"
                                        placeholderTextColor="rgba(244,235,208,0.5)"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={togglePasswordVisibility}
                                    >
                                        <Image source={getPasswordVisibilityIcon()} style={styles.icon} />
                                    </TouchableOpacity>
                                </View>
                                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                                <TouchableOpacity style={styles.forgotBtn}
                                onPress={() => navigation.navigate('Forgot')}>
                                <Text style={styles.forgotBtn1}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.termsContainer}>
                                <TouchableOpacity onPress={() => setIsTermsAccepted(!isTermsAccepted)} style={styles.checkboxWrapper}>
                                    <View style={[styles.checkbox, isTermsAccepted && styles.checkboxChecked]}>
                                        {isTermsAccepted && <Text style={styles.checkboxText}>✔</Text>}
                                    </View>
                                    <Text style={styles.termsText}>I agree to the <Text style={styles.termsLink} onPress={() => navigation.navigate('Terms')}>Terms and Conditions</Text></Text>
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity
                                style={styles.signInButton}
                                onPress={handleSignIn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="large" color="#fff" />
                                ) : (
                                    <Text style={styles.signInButtonText}>Sign In</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.signInTextContainer}>
                            <Text style={styles.signInText}>Don't have an Account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={[styles.signInText, styles.signUpText]}>Sign Up</Text>
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
        justifyContent: 'space-between',
    },
    overlay: {
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 10,
    },
    topView: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        color: '#D6AD60',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
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
        color: '#D6AD60',
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
        width: '100%',
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
        width: '100%',
        height: '100%',
    },
    signInTextContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    signInText: {
        fontSize: 14,
        color: '#D6AD60',
    },
    signUpText: {
        color: '#F4EBD0',
        marginLeft: 5,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        color:'red'
    },
    forgotBtn:{
        flexDirection: 'row',
        justifyContent:'flex-end',
        marginTop:10,
        marginRight:5
    },
    forgotBtn1:{
        color:'#ccc'
    },

    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:10
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#D6AD60',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: '#D6AD60',
    },
    checkboxText: {
        color: '#fff',
        fontSize: 16,
    },
    termsText: {
        fontSize: 14,
        color: '#D6AD60',
    },
    termsLink: {
        color: '#F4EBD0',
        textDecorationLine: 'underline',
    },
    
});

export default SignIn;
