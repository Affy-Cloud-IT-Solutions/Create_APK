import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    BackHandler
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PROPERTY_GET, APPROVAL_PROPERTY } from "../Config/api";
import CustomAlert from "../Componant/CustomAlert";

const AgentsProperties = ({ navigation }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertImage, setAlertImage] = useState(null);

    useEffect(() => {
        fetchProperties();

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                navigation.goBack();
                return true;
            }
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                throw new Error("Token not found");
            }

            const response = await axios.get(PROPERTY_GET, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const pendingProperties = response.data.meta.properties.filter(
                (property) => property.adminApproval === "pending"
            );

            setProperties(pendingProperties);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
            setAlertMessage("Error loading properties. Please try again later.");
            setAlertImage(require("../src/reject.png"));
            setAlertVisible(true);
        }
    };

    const updatePropertyApproval = async (propertyId, status) => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                throw new Error("Token not found");
            }

            const response = await axios.put(APPROVAL_PROPERTY, 
                { propertyId, adminApproval: status }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setAlertMessage(`Property has been ${status}`);
                setAlertImage(status === "approved" ? require("../src/check.png") : require("../src/reject.png"));
                setAlertVisible(true);
                fetchProperties();
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (err) {
            setAlertMessage("Error updating property status. Please try again later.");
            setAlertImage(require("../src/reject.png"));
            setAlertVisible(true);
        }
    };

    const handleApprove = (propertyId) => {
        Alert.alert(
            "Approve Property",
            "Are you sure you want to approve this property?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Approve", onPress: () => updatePropertyApproval(propertyId, "approved") },
            ]
        );
    };

    const handleReject = (propertyId) => {
        Alert.alert(
            "Reject Property",
            "Are you sure you want to reject this property?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Reject", onPress: () => updatePropertyApproval(propertyId, "rejected") },
            ]
        );
    };

    const handleCardPress = (id) => {
        navigation.navigate('AdminProdetail', { propertyId: id });
    };

    const renderHeader = () => (
        <View>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={25} color="#F4EBD0" />
            </TouchableOpacity>
            <View style={styles.head}>
                <View style={styles.textContainer}>
                    <Text style={styles.heading}>Pending Properties</Text>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.loaderContainer]}>
                <ActivityIndicator size="large" color="#D6AD60" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Error loading properties: {error.message}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {properties.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="home-minus" size={100} color="#F4EBD0" />
                    <Text style={styles.emptyMessage}>No Pending Properties Available</Text>
                </View>
            ) : (
                <FlatList
                    data={properties}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item: property }) => (
                        <TouchableOpacity
                            key={property._id}
                            onPress={() => handleCardPress(property._id)}
                            style={styles.card}
                        >
                            {property.images.length > 0 ? (
                                <Image
                                    source={{ uri: property.images[0] }}
                                    style={styles.cardImage}
                                />
                            ) : (
                                <View style={[styles.cardImage, styles.noImageContainer]}>
                                    <Text style={styles.noImageText}>No Image Available</Text>
                                </View>
                            )}
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{property.title}</Text>
                                </View>
                            </View>
                            <Text style={styles.prize}>₹ {property.price}</Text>
                            <View style={styles.locationContainer}>
                                <Icon name="map-marker" size={20} style={styles.locationIcon} />
                                <Text style={styles.locationText}>
                                    {property.city}, {property.country}
                                </Text>
                            </View>
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    style={styles.button1}
                                    onPress={() => handleReject(property._id)}
                                >
                                    <Icon
                                        name="square-edit-outline"
                                        size={20}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={[styles.buttonText, { color: 'red' }]}>Reject</Text>
                                </TouchableOpacity>                            
                                <TouchableOpacity
                                    style={styles.button1}
                                    onPress={() => handleApprove(property._id)}
                                >
                                    <Icon
                                        name="square-edit-outline"
                                        size={20}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={[styles.buttonText, { color: 'green' }]}>Approved</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item._id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
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
        backgroundColor: "#122620",
    },
    loaderContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        paddingHorizontal: 20,
        marginTop:15
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: 'rgba(128, 128, 128,1)'
    },
    textContainer: {
        flex: 1,
    },
    heading: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#F4EBD0",
    },
    flatListContent: {
        flexGrow: 1,
    },
    noImageContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
    },
    noImageText: {
        color: "#555",
        fontSize: 16,
        fontWeight: "bold",
    },
    button1: {
        backgroundColor: "#fff",
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
    },
    buttonText: {
        color: "#000",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        margin: 10,
        overflow: "hidden",
        paddingBottom: 10,
    },
    cardImage: {
        height: 200,
        width: "100%",
    },
    cardContent: {
        paddingHorizontal: 10,
        marginTop:10
    },
    cardHeader: {
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    prize: {
        fontSize: 20,
        fontWeight: "bold",
        paddingHorizontal: 10,
        marginTop:5
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        marginBottom:10
    },
    locationIcon: {
        color: "#000",
    },
    locationText: {
        color: "#000",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap:20,
        borderTopWidth:1,
        borderColor:'#ddd'

    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyMessage: {
        fontSize: 18,
        color: '#F4EBD0',
    },
});

export default AgentsProperties;
