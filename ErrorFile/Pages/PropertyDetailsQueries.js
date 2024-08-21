import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Text,
    Modal,
    SafeAreaView,
    BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import backIcon from '../src/back.webp';

export default function PropertyDetailsQueries() {
    const [property, setProperty] = useState({});
    const navigation = useNavigation();
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const handleBackPress = () => {
            navigation.goBack();
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [navigation]);

    useEffect(() => {
        if (route.params?.property) {
            setProperty(route.params.property.propertyId);
        }
    }, [route.params?.property]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleImagePress = (uri) => {
        setSelectedImage(uri);
        setModalVisible(true);
    };

    const images = property?.images || [];

    const getIconName = (amenity) => {
        switch (amenity) {
            case 'Swimming Pool':
                return 'tint';
            case 'Gym':
                return 'heartbeat';
            case 'Parking':
                return 'car';
            default:
                return 'check';
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
                        <Image source={backIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                </View>
                {selectedImage && (
                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Icon name="close" size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )}
                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
                            {images.map((uri, index) => (
                                <TouchableOpacity key={index} onPress={() => handleImagePress(uri)}>
                                    <Image source={{ uri }} style={styles.image} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles.infoContainer}>
                    <Text style={styles.name}>{property?.title || 'Title not available'}</Text>
                    </View>
                    <View style={styles.infoPrize}>
                        <Text style={styles.prize}>₹ {property?.price || 'Price not available'}</Text>
                    </View>
                    <View style={styles.infoDescription}>
                        <Text style={styles.dec}>{property?.description || 'Title not available'}</Text>
                        <Text style={styles.description}>- Status :  {property?.status || 'Status not available'}</Text>
                        <Text style={styles.description}>-  Size : {property?.area || 'Size not available'} Sq.Ft</Text>
                        <Text style={styles.description}>-  Location : {property.city} , {property.country}</Text>
                        <Text style={styles.description}>-  Construction Year :  {property.constructionYear}</Text>
                        <Text style={styles.description}>-  Bedrooms : {property.numberOfBathrooms}</Text>
                        <Text style={styles.description}>-  Floor : {property.floor}</Text>
                    </View>
                    <View style={styles.ProDetails}>
                        <Text style={styles.ProText}>Property Details</Text>
                        <View style={styles.detailRow}>
                            <Icon name="home" size={20} style={styles.detailIcon} />
                            <Text style={styles.detailText}>Property Type :</Text>
                            <Text style={styles.detailText1}>N/A</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Icon name="expand" size={20} style={styles.detailIcon} />
                            <Text style={styles.detailText}>Property Size :</Text>
                            <Text style={styles.detailText1}>{property.area || 'Size not available'} ft²</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Icon name="bath" size={20} style={styles.detailIcon} />
                            <Text style={styles.detailText}>Bathrooms :</Text>
                            <Text style={styles.detailText1}>{property?.numberOfBathrooms || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.listing}>
                        <Icon name="check-circle" size={17} color="#008000" />
                        <Text style={styles.DecText}>Eleganza has verified this listing</Text>
                    </View>

                    <View style={styles.ProDetails}>
                        <Text style={styles.ProText}>Amenities</Text>
                        {property?.amenities && property.amenities.map((amenity, index) => (
                            <View style={styles.detailRow1} key={index}>
                                <Icon name={getIconName(amenity)} size={15} style={styles.detailIcon} />
                                <Text style={styles.detailText}>{amenity}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.locationContainer}>
                        <Text style={styles.locationTitle}>Location & Nearby</Text>
                        <View style={styles.locationContainerLoc}>
                            <Icon name="map-marker" size={20} style={styles.locationIcon} />
                            <Text style={styles.locationDescription}>{property?.city || 'City not available'} , {property?.country || 'Country not available'}</Text>
                        </View>
                        <View style={styles.mapdec}>
                            {property?.latitude && property?.longitude ? (
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: property.latitude,
                                        longitude: property.longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: property.latitude,
                                            longitude: property.longitude,
                                        }}
                                        title="Property Location"
                                    />
                                </MapView>
                            ) : (
                                <Text style={styles.noLocationText}>Location data not available</Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#122620',
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    backButton: {
        marginTop: 10,
        marginLeft: 5
    },
    backIcon: {
        width: 25,
        height: 20,
        tintColor: '#ccc',
    },
    headerContainer: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    imagesContainer: {
        flexDirection: 'row',
    },
    image: {
        width: 320,
        height: 220,
        marginRight: 10,
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalImage: {
        width: '95%',
        height: '40%',
        borderRadius: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    infoPrize: {
        marginTop: 5,
    },
    scrollContainer: {
        flex: 1,
        marginTop: 10,
    },
    infoDescription: {
        marginTop: 10,
        width: '80%',
    },
    title: {
        fontSize: 15,
        color: '#fff',
        marginRight: 5,
    },
    prize: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ccc',
    },
    name: {
        fontSize: 17,
        color: '#D6AD60',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dec: {
        fontSize: 17,
        color: '#ccc',
        marginBottom: 5,
    },
    verifiedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'green',
        paddingHorizontal: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    verifiedText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 8,
    },
    description: {
        color: '#fff',
        fontSize: 13,
        marginTop: 8
    },
    FullInfo: {
        marginTop: 15,
    },
    button: {
        width: '90%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1,
        margin: 'auto',
        borderColor: '#F4EBD0',
    },
    buttonText: {
        color: '#F4EBD0',
        fontSize: 16,
    },
    ProDetails: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#FFFFFF33',
        paddingTop: 10,
    },
    locationContainer: {
        borderTopWidth: 1,
        borderColor: '#FFFFFF33'
    },
    locationTitle: {
        color: '#fff',
        fontSize: 21,
        marginBottom: 10,
        marginTop: 15
    },
    locationContainerLoc: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    locationDescription: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 10,
    },
    locationIcon: {
        fontSize: 24,
        color: '#ccc'
    },
    mapdec: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'center',
    },
    map: {
        height: 200,
        width: '90%',
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailRow1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailIcon: {
        color: '#ccc',
        marginRight: 10,
    },
    detailText: {
        color: '#fff',
        fontSize: 14,
    },
    detailText1: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 15,
    },
    ProText: {
        color: '#fff',
        fontSize: 21,
        marginBottom: 15,
    },
    listing: {
        width: '90%',
        height: 35,
        margin: 'auto',
        flexDirection: 'row',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#cccc',
        borderRadius: 10,
        gap: 10,
        marginTop: 10,
    },
    DecText: {
        color: '#fff',
    },
});
