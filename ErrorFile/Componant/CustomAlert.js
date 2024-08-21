import React from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';

const CustomAlert = ({ visible, message, onClose, imgSrc }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.alertBox}>
                    <Text style={styles.message}>{message}</Text>
                    <Image source={imgSrc} style={styles.logo} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    alertBox: {
        width: 250,
        padding: 17,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    message: {
        marginBottom: 5,
        fontSize: 15,
        textAlign: 'center',
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        marginTop: 5,
    },
});

export default CustomAlert;
