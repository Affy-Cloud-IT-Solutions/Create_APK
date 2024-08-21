import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    BackHandler,
} from "react-native";
import BottomNavbar from '../Componant/BottomNavbar';
import backIcon from '../src/back.webp';
import three from "../src/images3D.png"

const ThreeDModel = ({ navigation }) => {
    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true; 
        };

        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topButtonsContainer}>
                    <TouchableOpacity
                        style={styles.topButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={backIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.contentContainer}>
                    <Image source={three} style={styles.threeDIcon} />
                    <Text style={styles.message}>3D Model is not available</Text>
                    <Text style={styles.message1}>
                        Unfortunately, the 3D model for this property is currently unavailable. 
                        We are working on bringing you an immersive experience soon.
                    </Text>
                </View>
            </View>
            <BottomNavbar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    topButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    topButton: {
        fontSize: 17,
    },
    backIcon: {
        width: 20,
        height: 20,
        tintColor: '#ccc',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    threeDIcon: {
        width: 125,
        height: 110,
        marginBottom: 5,
        tintColor: '#D6AD60',
    },
    message: {
        fontSize: 18,
        color: '#F4EBD0',
        textAlign: 'center',
    },
    message1:{
        marginTop:10,
        fontSize: 13,
        color: '#fff',
        textAlign: 'center',
    }
});

export default ThreeDModel;