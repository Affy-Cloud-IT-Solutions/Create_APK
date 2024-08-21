// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ImageBackground, SafeAreaView, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation } from '@react-navigation/native';
// import emailIcon from '../src/email.png';
// import phoneIcon from '../src/phone.png';
// import backIcon from '../src/back.webp';
// import { EDIT_USER_DETAILS } from '../Config/api';

// const UpdateProfile = () => {
//     const navigation = useNavigation();
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);   

//     const showDatePicker = () => {
//         setDatePickerVisibility(true);
//     };

//     const hideDatePicker = () => {
//         setDatePickerVisibility(false);
//     };

//     const handleConfirm = (date) => {
//         setAge(date.toDateString());
//         hideDatePicker();
//     };


//     return (
//         <SafeAreaView style={styles.container}>
//             <ImageBackground
//                 source={require('../src/backimg.png')}
//                 style={styles.backgroundImage}
//                 resizeMode="cover"
//             >
//                 <ScrollView contentContainerStyle={styles.scrollViewContent}>
//                     <View style={styles.overlay}>
//                         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                             <Image source={backIcon} style={styles.backIcon} />
//                         </TouchableOpacity>

//                         <View style={styles.formContainer}>
//                             <Text style={styles.welcomeText}>Edit your profile</Text>
//                             <View style={styles.inlineInputContainer}>
//                                 <View style={styles.inlineInputWrapper}>
//                                     <Text style={styles.label}>First Name</Text>
//                                     <TextInput
//                                         style={styles.inlineInput0}
//                                         placeholder="First Name"
//                                         placeholderTextColor="rgba(244,235,208,0.5)"
//                                         autoCapitalize="words"                                       
//                                     />
//                                 </View>
//                                 <View style={styles.inlineInputWrapper}>
//                                     <Text style={styles.label}>Last Name</Text>
//                                     <TextInput
//                                         style={styles.inlineInput0}
//                                         placeholder="Last Name"
//                                         placeholderTextColor="rgba(244,235,208,0.5)"
//                                         autoCapitalize="words"
                                        
//                                     />
//                                 </View>
//                             </View>
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Email</Text>
//                                 <View style={styles.inputWrapper}>
//                                     <Image source={emailIcon} style={styles.icon} />
//                                     <TextInput
//                                         style={styles.input}
//                                         placeholder="Example@gmail.com"
//                                         placeholderTextColor="rgba(244,235,208,0.5)"
//                                         keyboardType="email-address"
//                                         autoCapitalize="none"
                                    
//                                     />
//                                 </View>
//                             </View>
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Number</Text>
//                                 <View style={styles.inputWrapper}>
//                                     <Image source={phoneIcon} style={styles.icon} />
//                                     <TextInput
//                                         style={styles.input}
//                                         placeholder="7275-667722"
//                                         placeholderTextColor="rgba(244,235,208,0.5)"
//                                         keyboardType="numeric"
//                                         autoCapitalize="none"
                                       
//                                     />
//                                 </View>
//                             </View>

//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Date of Birth</Text>
//                                 <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
//                                     <TextInput
//                                         style={styles.datePickerText}
//                                         placeholder="Date of Birth"
//                                         placeholderTextColor="rgba(244,235,208,0.5)"
//                                         editable={false}
//                                         pointerEvents="none"
                                     
//                                     />
//                                 </TouchableOpacity>
//                                 <DateTimePickerModal
//                                     isVisible={isDatePickerVisible}
//                                     mode="date"
//                                     onConfirm={handleConfirm}
//                                     onCancel={hideDatePicker}
//                                 />
//                             </View>
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Gender</Text>
//                                 <View style={styles.pickerWrapper}>
//                                     <Picker
                                      
//                                         onValueChange={(itemValue) => setGender(itemValue)}
//                                         style={styles.picker}
//                                         dropdownIconColor="#D6AD60"
//                                     >
//                                         <Picker.Item label="Select gender" value="" color="#000" />
//                                         <Picker.Item label="Male" value="Male" color="#000" />
//                                         <Picker.Item label="Female" value="Female" color="#000" />
//                                     </Picker>
//                                 </View>
//                             </View>
//                             <TouchableOpacity style={styles.signUpButton}>
//                                 <Text style={styles.signUpButtonText}>Submit</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </ScrollView>
//             </ImageBackground>
//         </SafeAreaView>
//     );
// };

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import emailIcon from '../src/email.png';
import phoneIcon from '../src/phone.png';
import backIcon from '../src/back.webp';
import { EDIT_USER_DETAILS } from '../Config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateProfile = () => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setAge(date.toDateString());
        hideDatePicker();
    };

    const handleSubmit = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const token = await AsyncStorage.getItem('userToken');
            console.log(userId)
            const response = await axios.put(`${EDIT_USER_DETAILS}/${userId}`, {
                firstName,
                lastName,
                email,
                phoneNumber,
                age,
                gender,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Profile updated successfully');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
            console.error(error);
            
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
                            <Image source={backIcon} style={styles.backIcon} />
                        </TouchableOpacity>

                        <View style={styles.formContainer}>
                            <Text style={styles.welcomeText}>Edit your profile</Text>
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
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Date of Birth</Text>
                                <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
                                    <TextInput
                                        style={styles.datePickerText}
                                        placeholder="Date of Birth"
                                        placeholderTextColor="rgba(244,235,208,0.5)"
                                        editable={false}
                                        pointerEvents="none"
                                        value={age}
                                    />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
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
                            <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit}>
                                <Text style={styles.signUpButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    backButton: {
        marginTop: 10,
        marginLeft: 5      
    },
    backIcon: {
        width: 20,
        height: 20,
        tintColor: '#ccc',
    },
    inlineInputContainer: {
        flexDirection: 'row',
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
    datePickerButton: {
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
    datePickerText: {
        color: "rgba(244,235,208,0.5)",
        height: 25,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#D6AD60',
        borderRadius: 50,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        color: "rgba(244,235,208,0.5)",
        height: 40,
        textAlign: 'center',
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
    },
    overlay: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    welcomeText: {
        color: '#ccc',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 30,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    inputContainer: {
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        marginBottom: 4,
        color: '#D6AD60',
        marginTop: 2,
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
    signUpButton: {
        backgroundColor: '#D6AD60',
        width: '70%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 10,
        margin:'auto'
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default UpdateProfile;
