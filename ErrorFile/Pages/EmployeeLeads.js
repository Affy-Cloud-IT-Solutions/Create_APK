import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    BackHandler
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GET_EMPLOYEE_QUERIES } from "../Config/api";

const EmployeeLeads = () => {
    const navigation = useNavigation();
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");

                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await axios.get(GET_EMPLOYEE_QUERIES, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const leadsData = response.data.assignedQueries.map(query => ({
                    ...query.queryId[0],  
                    priority: query.priority,
                }));

                setLeads(leadsData);
            } catch (error) {
                console.error("Error fetching leads:", error);
            }
        };

        fetchLeads();
    }, []);
    
    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true; 
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove(); 
    }, [navigation]);

    const getStatusIconAndColor = (status) => {
        switch (status) {
            case "Hot":
                return { name: "fire", color: "red" };
            case "Warm":
                return { name: "weather-sunset", color: "orange" };
            case "Cold":
                return { name: "snowflake", color: "#0899c9" };
            default:
                return { name: "help-circle", color: "#D6AD60" };
        }
    };

    const renderItem = ({ item }) => {
        const { name, color } = getStatusIconAndColor(item.priority);

        return (
            <View key={item.id} style={styles.card}>
                <View style={styles.statusContainer}>
                    <View style={styles.statusIcon}>
                        <Icon name={name} size={18} color={color} />
                        <Text style={[styles.statusText, { color }]}>{item.priority}</Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.agentName}>{item.name}</Text>
                    <View style={styles.contactDetails}>
                        <View style={styles.cardRow}>
                            <Icon
                                name="phone"
                                size={20}
                                color="#D6AD60"
                                style={styles.icon}
                            />
                            <Text style={styles.contactText}>{item.phone}</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Icon
                                name="email"
                                size={20}
                                color="#D6AD60"
                                style={styles.icon}
                            />
                            <Text style={styles.contactText}>{item.email}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={25} color="#D6AD60" />
                </TouchableOpacity>
                <Text style={styles.heading}>Leads:</Text>
            </View>
            <View style={styles.separator}></View>
            <FlatList
                data={leads}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#122620",
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        gap: 15,
    },
    heading: {
        fontSize: 20,
        color: "#D6AD60",
        flex: 1,
    },
    dropdownArea: {
        marginTop: 15,
        paddingHorizontal: 25,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
    },
    dropdown: {
        width: 230,
        borderWidth: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(244, 235, 208, 0.4)",
        borderRadius: 5,
        color: "#FFFFFF",
        zIndex: 1000,
    },
    dropdownContainer: {
        width: 230,
        borderRadius: 5,
        backgroundColor: "#1A1A1A",
        borderColor: "rgba(244, 235, 208, 0.2)",
        zIndex: 1000,
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    sortArea: {
        marginBottom: 10,
        paddingHorizontal: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        zIndex: 900,
    },
    dropdown2: {
        width: 90,
        borderRadius: 5,
        backgroundColor: "transparent",
        borderColor: "rgba(244, 235, 208, 0.2)",
        zIndex: 900,
    },
    dropdownContainer2: {
        width: 90,
        borderRadius: 10,
        backgroundColor: "#1A1A1A",
        borderColor: "rgba(244, 235, 208, 0.2)",
        zIndex: 900,
    },
    text2: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    assignButton: {
        backgroundColor: "#D6AD60",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    assignButtonText: {
        color: "#F4EBD0",
        fontSize: 18,
    },
    separator: {
        height: 1,
        width: "100%",
        backgroundColor: "rgba(244, 235, 208, 0.2)",
        marginBottom: 10,
        marginTop: 20,
    },
    card: {
        paddingHorizontal: 11,
        backgroundColor: "rgba(128, 128, 128,0.5)",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(244, 235, 208, 0.3)",
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statusIcon: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom:5
    },
    statusText: {
        fontSize: 16,
        marginLeft: 5,
        fontWeight: "bold",
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    label: {
        fontSize: 14,
        color: "#D6AD60",
    },
    agentName: {
        fontSize: 18,
        color: "#F4EBD0",
        fontWeight: "bold",
    },
    contactDetails: {
        marginTop: 5,
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    contactText: {
        fontSize: 14,
        color: "#F4EBD0",
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },
    checkBoxContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
});

export default EmployeeLeads;
