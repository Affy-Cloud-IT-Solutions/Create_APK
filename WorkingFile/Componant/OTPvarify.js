import React, { useState, useRef } from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { OTP, RESEND_OTP } from '../Config/api'; 
import ModelScreenPass from '../Componant/ModelScreenPass'; 

const OTPVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendText, setResendText] = useState('Resend');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const inputs = useRef([]);
    const route = useRoute();
    const navigation = useNavigation();
    const { email } = route.params; 

    const handleChange = (text, index) => {
        let newOtp = [...otp];
        newOtp[index] = text;

        if (text.length === 1 && index < 5) {
            inputs.current[index + 1]?.focus();
        }
        if (text.length === 0 && index > 0) {
            inputs.current[index - 1]?.focus();
        }

        setOtp(newOtp);
    };

    const handleSubmit = async () => {
        const otpCode = otp.join('');
        try {
            const response = await fetch(OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otpCode }), 
            });
            if (response.success) {
                setModalMessage('OTP verified successfully');
                setModalVisible(true);
                setTimeout(() => {
                    setModalVisible(false);
                    navigation.navigate('SignIn');
                }, 2000);
            } else {
                setModalMessage('Invalid OTP ! Please check your OTP and try again.');
                setModalVisible(true);
                setTimeout(() => setModalVisible(false), 2000);
            }
        } catch (error) {
            setModalMessage('An error occurred while verifying OTP. Please try again.');
            setModalVisible(true);
            setTimeout(() => setModalVisible(false), 2000);
        }
    };

    const handleResend = async () => {
        setResendText('Resend...');
        try {
            const response = await fetch(RESEND_OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.success) {
                setModalMessage('OTP resent successfully');
                setModalVisible(true);
                setResendText('Resend');
                setTimeout(() => setModalVisible(false), 2000);
            } else {
                setModalMessage('An error occurred while resending OTP. Please try again.');
                setModalVisible(true);
                setResendText('Resend');
                setTimeout(() => setModalVisible(false), 2000);
            }
        } catch (error) {
            setModalMessage('An error occurred while resending OTP. Please try again.');
            setModalVisible(true);
            setResendText('Resend');
            setTimeout(() => setModalVisible(false), 2000);
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
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../src/otp.png')}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.otpContainer}>
                        <Text style={styles.title}>Enter your</Text>
                        <Text style={styles.title1}>Verification Code</Text>
                        <Text style={styles.subtitle}>
                            We will send you <Text style={styles.boldText}>One Time Passcode</Text>
                        </Text>
                        <Text style={styles.subtitle}>
                            via this <Text style={styles.boldText1}>{email}</Text> address
                        </Text>
                        <View style={styles.otpInputs}>
                            {otp.map((value, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => (inputs.current[index] = ref)}
                                    style={styles.otpInput}
                                    value={value}
                                    onChangeText={(text) => handleChange(text, index)}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    textAlign="center"
                                />
                            ))}
                        </View>
                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText0}>Didn't get it? </Text>
                            <TouchableOpacity onPress={handleResend}>
                                <Text style={styles.resendText}>
                                    {resendText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Verify OTP</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
            <ModelScreenPass 
                isVisible={modalVisible} 
                onClose={() => setModalVisible(false)} 
                message={modalMessage} 
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
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 200,
    },
    otpContainer: {
        width: '90%',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#D6AD60',
    },
    title1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#D6AD60',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
    boldText1: {
        fontWeight: 'bold',
        color: '#D6AD60',
    },
    otpInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 5,
        marginTop: 15,
    },
    otpInput: {
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        backgroundColor: '#F5F7F8',
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
    },
    resendContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 13,
        color: '#fff',
        backgroundColor:'#D6AD60',
        marginTop:5,
        borderWidth:1,
        paddingHorizontal:10,
        paddingVertical:1,
        borderRadius:50
    },
    resendText0:{
        color:'#fff',
        fontSize:14,
        marginTop:5
    },
    submitButton: {
        backgroundColor: '#D6AD60',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        marginTop:25
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OTPVerify;
