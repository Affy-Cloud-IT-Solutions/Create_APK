    import React, { useState } from 'react';
    import { View, StyleSheet, ImageBackground, SafeAreaView, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
    import { useNavigation } from '@react-navigation/native';
    import { Picker } from '@react-native-picker/picker';
    import emailIcon from '../src/email.png';
    import passwordVisibleIcon from '../src/open.png';
    import passwordHiddenIcon from '../src/close.png';
    import phoneIcon from '../src/phone.png';
    import { enforceMaxLength } from '../Componant/utility';
    import { registerService } from '../Config/services';
    import CustomAlert from '../Componant/CustomAlert';
    import successIcon from '../src/check.png'; 
    import errorIcon from '../src/reject.png'; 

    const SignUp = () => {
        
        const navigation = useNavigation();
        const [showPassword, setShowPassword] = useState(false);
        const [phoneNumber, setPhoneNumber] = useState('');
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPwd, setConfirmPwd] = useState('');
        const [gender, setGender] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [alertMessage, setAlertMessage] = useState('');
        const [alertIcon, setAlertIcon] = useState(null);
        const [showAlert, setShowAlert] = useState(false);

        const handleTextChange = (text) => {
            const enforcedText = enforceMaxLength(text);
            setPhoneNumber(enforcedText);
        };

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const getPasswordVisibilityIcon = () => {
            return showPassword ? passwordVisibleIcon : passwordHiddenIcon;
        };

        const handleSignUp = async () => {
            if (password !== confirmPwd) {
                setAlertMessage('Passwords do not match');
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 2000);
                return;
            }

            const payload = {
                firstName,
                lastName,
                email,
                password,
                confirmPwd,
                roleName: "user",
                phoneNumber, 
                gender,
            };
            setIsLoading(true);

            try {
                // console.log('1111', payload)
                const response = await registerService(payload);
                if (response.error) {
                    setAlertMessage(response.message);
                    setAlertIcon(errorIcon);
                    setShowAlert(true);
                } else {
                    setAlertMessage('Successful! Verify your Email');
                    setAlertIcon(successIcon);
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                        navigation.navigate('otpvarify', { email });
                    }, 2000);
                }
            } catch (error) {
                setAlertMessage(error.message);
                setAlertIcon(errorIcon);
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 2000);
            } finally {
                setIsLoading(false);
            }
        };

        const handleCloseAlert = () => {
            setShowAlert(false);
        };


        const handleConfirm = (date) => {
            const selectedage = date.toISOString().split('T')[0];
            setage(selectedage); 
            hideDatePicker();
        };

        return (
            <SafeAreaView style={styles.container}>
                {showAlert && <CustomAlert message={alertMessage} onClose={handleCloseAlert} imgSrc={alertIcon} />}
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
                                <Text style={styles.welcomeText}>Sign Up</Text>
                                <View style={styles.inlineInputContainer}>
                                    <View style={styles.inlineInputWrapper}>
                                        <Text style={styles.label}>First Name</Text>
                                        <TextInput
                                            style={styles.inlineInput0}
                                            placeholder="First Name"
                                            placeholderTextColor="rgba(244,235,208,0.5)"
                                            autoCapitalize="words"
                                            value={firstName}
                                            onChangeText={setFirstName}
                                        />
                                    </View>
                                    <View style={styles.inlineInputWrapper}>
                                        <Text style={styles.label}>Last Name</Text>
                                        <TextInput
                                            style={styles.inlineInput0}
                                            placeholder="Last Name"
                                            placeholderTextColor="rgba(244,235,208,0.5)"
                                            autoCapitalize="words"
                                            value={lastName}
                                            onChangeText={setLastName}
                                        />
                                    </View>
                                </View>
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
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Number</Text>
                                    <View style={styles.inputWrapper}>
                                        <Image source={phoneIcon} style={styles.icon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="7275-667722"
                                            placeholderTextColor="rgba(244,235,208,0.5)"
                                            keyboardType="numeric"
                                            autoCapitalize="none"
                                            onChangeText={handleTextChange}
                                            value={phoneNumber}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inlineInputContainer}>
                                    <View style={styles.inlineInputWrapper}>
                                        <Text style={styles.label}>Password</Text>
                                        <View style={styles.inlineInput}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="********"
                                                placeholderTextColor="rgba(244,235,208,0.5)"
                                                secureTextEntry={!showPassword}
                                                value={password}
                                                onChangeText={setPassword}
                                            />
                                            <TouchableOpacity onPress={togglePasswordVisibility}>
                                                <Image source={getPasswordVisibilityIcon()} style={styles.iconpass} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.inlineInputWrapper}>
                                        <Text style={styles.label}>Confirm Password</Text>
                                        <View style={styles.inlineInput}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="********"
                                                placeholderTextColor="rgba(244,235,208,0.5)"
                                                secureTextEntry={!showPassword}
                                                value={confirmPwd}
                                                onChangeText={setConfirmPwd}
                                            />
                                            <TouchableOpacity onPress={togglePasswordVisibility}>
                                                <Image source={getPasswordVisibilityIcon()} style={styles.iconpass} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Gender</Text>
                                    <View style={styles.pickerWrapper}>
                                        <Picker
                                            selectedValue={gender}
                                            onValueChange={(itemValue) => setGender(itemValue)}
                                            style={styles.picker}
                                            dropdownIconColor="#D6AD60"
                                        >
                                            <Picker.Item label="Select gender" value="" color="#000" />
                                            <Picker.Item label="Male" value="Male" color="#000" />
                                            <Picker.Item label="Female" value="Female" color="#000" />
                                        </Picker>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={isLoading}>
                                    {isLoading ? (
                                        <ActivityIndicator size="large" color="#fff" />
                                    ) : (
                                        <Text style={styles.signUpButtonText}>Sign UP</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.signUpTextContainer}>
                                <Text style={styles.signUpText}>Already have an Account?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                                    <Text style={styles.signUpLink}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </SafeAreaView>
        );
    };


const styles = StyleSheet.create({
    inlineInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    inlineInputWrapper: {
        flex: 1,
        marginRight: 7,
    },
    inlineInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D6AD60',
        borderRadius: 50,
        paddingHorizontal: 15,
        marginTop: 5,
        color: '#fff',
    },
    inlineInput0: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D6AD60',
        borderRadius: 50,
        paddingHorizontal: 15,
        marginTop: 5,
        paddingVertical: 3,
        color: '#fff',
    },
    datePickerButton:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D6AD60',
        borderRadius: 50,
        paddingHorizontal: 15,
        marginTop: 5,
        paddingVertical: 8,
        color: '#fff',
    },
    datePickerText:{
        color:"rgba(244,235,208,0.5)",
        height:25
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#D6AD60',
        borderRadius: 50,
        marginTop: 5,
        alignItems: 'center', // Center align items horizontally
        justifyContent: 'center', // Center align items vertically
    },
    picker: {
        width: '100%', // Ensure picker takes full width of the wrapper
        color: "rgba(244,235,208,0.5)",
        height: 40,
        textAlign: 'center', // Center text inside the picker
    },
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
        paddingVertical: 10,
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
        marginBottom: 30,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 7,
    },
    inputContainer: {
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        marginBottom: 4,
        color: '#D6AD60',
        marginTop:2
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
        padding: 3,
        fontSize: 16,
        color: '#fff',
    },
    icon: {
        width: 17,
        height: 17,
        marginRight: 10,
        tintColor: '#D6AD60',
    },
    iconpass: {
        width: 17,
        height: 17,
        tintColor: '#D6AD60',
    },
    signUpButton: {
        backgroundColor: '#D6AD60',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 5,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 18,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    signUpTextContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    signUpText: {
        fontSize: 14,
        color: '#333',
        color: '#D6AD60',
    },
    signUpText1: {
        color: '#F4EBD0',
        marginLeft: 5,
    },
    signUpLink:{
        color: '#F4EBD0',
        marginLeft:5
    }
});

export default SignUp;
