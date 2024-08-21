import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Text, TextInput, BackHandler, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Filter = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [selectedButton, setSelectedButton] = useState('Buy'); 
    const [selectedButtonType, setSelectedButtonType] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigation = useNavigation();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const handleButtonPress = (button) => {
        setSelectedButton(button);
    };

    const handleButtonPressType = (buttonType) => {
        setSelectedButtonType(buttonType);
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.goBack();
                return true; // Prevent default behavior (exit app)
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [navigation])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../src/backimg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.buttonContainermain}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.button0, selectedButton === 'Rent' && styles.selectedButton]}
                                onPress={() => handleButtonPress('Rent')}
                            >
                                <Text style={styles.buttonText}>Rent</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, selectedButton === 'Buy' && styles.selectedButton]}
                                onPress={() => handleButtonPress('Buy')}
                            >
                                <Text style={styles.buttonText}>BUY</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.button2, selectedButton === 'New Project' && styles.selectedButton]}
                                onPress={() => handleButtonPress('New Project')}
                            >
                                <Text style={styles.buttonText}>New project</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.typeContainer}>
                        <Ionicons name="home" size={18} color="white" />
                        <Text style={styles.typeText}> Property Type</Text>
                    </View>
                    <View style={styles.propertyButtonsContainer}>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.propertyButton, selectedButtonType === 'House' && styles.selectedButton]}
                                onPress={() => handleButtonPressType('House')}
                            >
                                <Text style={styles.buttonText}>House</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.propertyButton, selectedButtonType === 'Apartment' && styles.selectedButton]}
                                onPress={() => handleButtonPressType('Apartment')}
                            >
                                <Text style={styles.buttonText}>Apartment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.propertyButton, selectedButtonType === 'Land' && styles.selectedButton]}
                                onPress={() => handleButtonPressType('Land')}
                            >
                                <Text style={styles.buttonText}>Land</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.propertyButton, selectedButtonType === 'Warehouse' && styles.selectedButton]}
                                onPress={() => handleButtonPressType('Warehouse')}
                            >
                                <Text style={styles.buttonText}>Warehouse</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.propertyButton, selectedButtonType === 'Villa' && styles.selectedButton]}
                                onPress={() => handleButtonPressType('Villa')}
                            >
                                <Text style={styles.buttonText}>Villa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.typeContainer1}>
                        <Ionicons name="cash" size={18} color="white" />
                        <Text style={styles.typeText}>Price Range (₹)</Text>
                    </View>
                    <View style={styles.propertyButtonsPrice}>
                        <View style={styles.row1}>
                            <TextInput
                                style={styles.priceInput}
                                placeholder="No Min."
                                placeholderTextColor="#BBBBBB"
                                keyboardType="numeric"
                                value={minPrice}
                                onChangeText={setMinPrice}
                            />
                            <TextInput
                                style={styles.priceInput}
                                placeholder=" No Max."
                                placeholderTextColor="#BBBBBB"
                                keyboardType="numeric"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                            />
                        </View>
                    </View>
                    <View style={styles.typeContainer}>
                        <Ionicons name="diamond" size={17} color="white" />
                        <Text style={styles.typeText}>Amenities</Text>
                    </View>
                    
                </ScrollView>
                {/* Add the Show Properties button outside of the ScrollView for absolute positioning */}
                <TouchableOpacity
                    style={styles.showPropertiesButton}
                    onPress={() => console.log('Show Properties button pressed')}
                >
                    <Text style={styles.showPropertiesButtonText}>Show Properties</Text>
                </TouchableOpacity>
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
        padding: 15,
    },
    backButton: {
        marginTop: 20,
        marginLeft: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        margin: 'auto',
        marginTop: 15,
    },
    buttonContainermain: {
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BBBBBB',
    },
    button0: {
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
    },
    button2: {
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
    },
    selectedButton: {
        backgroundColor: '#D6AD60',
    },
    buttonText: {
        color: 'white',
        fontSize: 13,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
    },
    typeContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#BBBBBB',
        paddingVertical: 15,
    },
    typeText: {
        color: 'white',
        fontSize: 15,
        marginLeft: 10,
    },
    propertyButtonsContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    propertyButtonsPrice: {
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceInput: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#BBBBBB',
        borderRadius: 10,
        color: 'white',
        marginHorizontal: 10,
    },
    propertyButton: {
        flex: 1,
        paddingVertical: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BBBBBB',
        marginHorizontal: 5,
        borderRadius: 10,
    },
    showPropertiesButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#D6AD60',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    showPropertiesButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Filter;
 