import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GET_ALL_QUERIES, GET_ALL_EMPLOYEE, ASSIGN_QUERIE } from "../Config/api";

const CustomCheckBox = ({ isChecked, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.checkBoxContainer}>
            {isChecked ? (
                <Icon name="checkbox-marked" size={30} color="#D6AD60" />
            ) : (
                <Icon name="checkbox-blank-outline" size={30} color="#D6AD60" />
            )}
        </TouchableOpacity>
    );
};

const AllQueries = () => {
    const navigation = useNavigation();
    const [queries, setQueries] = useState([]);
    const [open, setOpen] = useState(false);
    const [agentValue, setAgentValue] = useState(null);
    const [agents, setAgents] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [statusOpen, setStatusOpen] = useState(false);
    const [statusValue, setStatusValue] = useState(null);
    const [statusItems, setStatusItems] = useState([
        { label: "Hot", value: "Hot" },
        { label: "Warm", value: "Warm" },
        { label: "Cold", value: "Cold" },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");

                if (token) {
                    const response = await axios.get(GET_ALL_QUERIES, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data && response.data.data) {
                        setQueries(response.data.data);
                    }

                    const agentsResponse = await axios.get(GET_ALL_EMPLOYEE, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (agentsResponse.data) {
                        const agentsList = agentsResponse.data.map((agent) => ({
                            label: `${agent.firstName} ${agent.lastName}`,
                            value: agent._id,
                        }));
                        setAgents(agentsList);
                    }
                } else {
                    console.error("Token not found");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleCheckboxPress = (index) => {
        setCheckedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleCardPress = (item) => {
        if (item.propertyId) {
            navigation.navigate('propertyDetailsQueries', {
                property: item,
            });
        }
    };

    const renderItem = ({ item, index }) => {
        const isChecked = checkedItems[index] || false;
        const isSold = !item.propertyId;

        return (
            <View style={[styles.card, isSold && styles.soldCard]}>
                <TouchableOpacity
                    style={styles.cardContent}
                    onPress={() => !isSold && handleCardPress(item)}
                    activeOpacity={isSold ? 1 : 0.8}
                >
                    <View style={styles.detailsContainer}>
                        <Text style={styles.label}>Title:</Text>
                        <Text style={styles.agentTitle}>
                            {item.propertyId?.title || "N/A"}
                        </Text>

                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.agentName}>{item.name || "N/A"}</Text>

                        <View style={styles.contactDetails}>
                            <View style={styles.cardRow}>
                                <Icon
                                    name="phone"
                                    size={20}
                                    color="#D6AD60"
                                    style={styles.icon}
                                />
                                <Text style={styles.contactText}>{item.phone || "N/A"}</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Icon
                                    name="email"
                                    size={20}
                                    color="#D6AD60"
                                    style={styles.icon}
                                />
                                <Text style={styles.contactText}>{item.email || "N/A"}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                {!isSold && !item.isAssigned && (
                    <CustomCheckBox
                        isChecked={isChecked}
                        onPress={() => handleCheckboxPress(index)}
                    />
                )}
                {isSold && (
                    <View style={styles.soldOverlay}>
                        <Text style={styles.soldText}>Sold</Text>
                    </View>
                )}
            </View>
        );
    };

    const handleAssign = async () => {
        const selectedQueries = queries.filter((_, index) => checkedItems[index]);
        const queryIds = selectedQueries.map(query => query._id);
        
        if (!agentValue) {
            alert("Please select an agent to assign the selected leads.");
            return;
        }
        if (selectedQueries.length === 0) {
            alert("Please select at least one lead to assign.");
            return;
        }
        if (!statusValue) {
            alert("Please select a priority status.");
            return;
        }
        
        const payload = {
            agent: agentValue,
            queryId: queryIds,
            priority: statusValue,
        };
        
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (token) {
                const response = await axios.post(ASSIGN_QUERIE, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                console.log("Response Status:", response.status);
                console.log("Response Data:", response.data);
    
                if (response.status === 201) {
                    alert("Leads successfully assigned!");
                    setCheckedItems({});
                    setAgentValue(null); // Reset agent dropdown
                    setStatusValue(null); // Reset status dropdown
                } else {
                    console.error("Error assigning leads:", response.data);
                    alert("Failed to assign leads. Please try again.");
                }
            } else {
                console.error("Token not found");
            }
        } catch (error) {
            console.error("Error assigning leads:", error);
            alert("An error occurred while assigning leads.");
        }
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
                <Text style={styles.heading}>All Leads</Text>
            </View>

            <View style={styles.dropdownArea1}>
                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        open={open}
                        value={agentValue}
                        items={agents}
                        setOpen={setOpen}
                        setValue={setAgentValue}
                        setItems={setAgents}
                        placeholder="Select Agent"
                        style={styles.dropdown1}
                        dropDownContainerStyle={styles.dropdownContainer1}
                        textStyle={styles.dropdownText1}
                        ArrowDownIconComponent={({ style }) => (
                            <Icon name="chevron-down" size={25} color="#FFFFFF" />
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <Icon name="chevron-up" size={25} color="#FFFFFF" />
                        )}
                    />
                </View>
                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        open={statusOpen}
                        value={statusValue}
                        items={statusItems}
                        setOpen={setStatusOpen}
                        setValue={setStatusValue}
                        setItems={setStatusItems}
                        placeholder="Select Status"
                        style={styles.dropdown1}
                        dropDownContainerStyle={styles.dropdownContainer1}
                        textStyle={styles.dropdownText1}
                        ArrowDownIconComponent={({ style }) => (
                            <Icon name="chevron-down" size={25} color="#FFFFFF" />
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <Icon name="chevron-up" size={25} color="#FFFFFF" />
                        )}
                    />
                </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.assignButtonContainer}>
                <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
                    <Text style={styles.assignButtonText}>Assign</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={queries}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    cardContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: "#122620",
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 15,
        gap: 15,
    },
    heading: {
        fontSize: 20,
        color: "#D6AD60",
        flex: 1,
    },
    dropdownArea1: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop:10,
        zIndex:1000
    },
    dropdown1: {
        borderWidth: 1,
        borderColor: "rgba(244, 235, 208, 0.4)",
        borderRadius: 10,
        color: "#FFFFFF",
    },
    dropdownContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    dropdownContainer1: {
        borderRadius: 5,
        backgroundColor: "#fff",
        borderColor: "rgba(244, 235, 208, 0.2)",
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    assignButtonContainer: {
        alignItems: 'flex-end', 
        
    },
    assignButton: {
        backgroundColor: "#D6AD60",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 5,
    },
    assignButtonText: {
        color: "#F4EBD0",
        fontSize: 18,
    },
    soldText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        width: "100%",
        backgroundColor: "rgba(244, 235, 208, 0.2)",
        marginBottom: 10,
        marginTop: 20,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: "rgba(128, 128, 128,0.5)",
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 15,
        borderColor: "rgba(244, 235, 208, 0.3)",
    },
    cardContent: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    detailsContainer: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        color: "#D6AD60",
        marginBottom: 5,
    },
    agentTitle: {
        fontSize: 15,
        color: "#F4EBD0",
        fontWeight: "bold",
        marginBottom: 5,
    },
    agentName: {
        fontSize: 16,
        color: "#F4EBD0",
    },
    contactDetails: {
        marginTop: 10,
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
    emptyText: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 15
    }
});

export default AllQueries;
