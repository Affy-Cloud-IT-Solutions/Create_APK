import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Dimensions,
  Animated,
} from "react-native";
import logo from "../src/secondary_logo.png";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Sidebar from "../Componant/Sidebar";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_ALL_EMPLOYEE, PROPERTY_GET } from '../Config/api';

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-width * 0.8)).current;
  const [pendingPropertyCount, setPendingPropertyCount] = useState(0);
  const [approvedPropertyCount, setApprovedPropertyCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const response = await axios.get(GET_ALL_EMPLOYEE);
        setEmployeeCount(response.data.length);
      } catch (error) {
        console.error('Error fetching employee count:', error);
      }
    };

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

        if (response.data && response.data.meta && response.data.meta.properties) {
          const properties = response.data.meta.properties;
          const pendingProperties = properties.filter(
            (property) => property.adminApproval === "pending"
          );
          const approvedProperties = properties.filter(
            (property) => property.adminApproval === "approved"
          );

          setPendingPropertyCount(pendingProperties.length);
          setApprovedPropertyCount(approvedProperties.length);
        } else {
          console.error('Error: Properties data is missing in the response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchEmployeeCount();
    fetchProperties();
  }, []);

  const toggleSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: isSidebarVisible ? -width * 0.8 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsSidebarVisible(!isSidebarVisible);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx < -50) {
          toggleSidebar();
        }
      },
    })
  ).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isSidebarVisible) {
        toggleSidebar();
      }
    });

    return unsubscribe;
  }, [isSidebarVisible, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar
        sidebarAnimation={sidebarAnimation}
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
      />

      {!isSidebarVisible && (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          {...panResponder.panHandlers}
        >
          <View style={styles.mainContent}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={toggleSidebar}
            >
              <Icon name="menu" size={28} color="#F4EBD0" />
            </TouchableOpacity>
            <View style={styles.head}>
              <View style={styles.textContainer}>
                <Text style={styles.heading}>Admin Dashboard</Text>
                <Text style={styles.slogan}>Good Afternoon</Text>
              </View>
              <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.seperator}></View>
            <View style={styles.analytics}>
              <View>
                <Text style={styles.analyticsText}>Page Analytics</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.detailsText}>See Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdown}>
                <Icon name="home-outline" size={20} color="#F4EBD0" />
                <Text style={styles.dropdownText}>Bedrooms</Text>
                <Icon name="chevron-down" size={20} color="#F4EBD0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdown}>
                <Icon name="calendar-outline" size={20} color="#F4EBD0" />
                <Text style={styles.dropdownText}>Last 30 Days</Text>
                <Icon name="chevron-down" size={20} color="#F4EBD0" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.BigBox}>
              <Icon name="bank-outline" size={35} color="#F4EBD0" />
              <Text style={styles.boxHead1}>All Posted Properties</Text>
              <Text style={styles.boxText1}>Total Property: {approvedPropertyCount}</Text>
              <Text style={styles.positiveChange}>+12% Increase</Text>
            </TouchableOpacity>

            <View style={styles.boxContainer}>
              <TouchableOpacity style={styles.box}>
                <Text style={styles.boxHead}>All Properties</Text>
                <Icon name="home" size={25} color="#F4EBD0" />
                <Text style={styles.boxText}>
                {approvedPropertyCount} <Text style={styles.positiveChange}>+10%</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box}>
                <Text style={styles.boxHead}>Employee's</Text>
                <Icon name="account-group-outline" size={25} color="#F4EBD0" />
                <Text style={styles.boxText}>
                {employeeCount} <Text style={styles.positiveChange}>+5%</Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxContainer}>
              <TouchableOpacity style={styles.box}>
                <Text style={styles.boxHead}>All Users</Text>
                <Icon name="eye-outline" size={25} color="#F4EBD0" />
                <Text style={styles.boxText}>
                  12,000 <Text style={styles.negativeChange}>-8%</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box}>
                <Text style={styles.boxHead}>Pending Property</Text>
                <Icon name="home" size={25} color="#F4EBD0" />
                <Text style={styles.boxText}>
                {pendingPropertyCount} <Text style={styles.positiveChange}>+13%</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#122620",
  },
  mainContent: {
    flex: 1,
  },
  menuButton: {
    padding: 20,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Adjust this value to add space at the bottom
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal:15
  },
  textContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F4EBD0",
  },
  slogan: {
    color: "#F4EBD0",
    fontWeight: "300",
    fontSize: 14,
    marginTop: 2,
  },
  logo: {
    width: 50,
    height: 60,
  },
  seperator: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(128, 128, 128,0.5)",
  },
  analytics: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  analyticsText: {
    color: "#F4EBD0",
    fontSize: 17,
    marginLeft: 8,
    marginTop: 8,
  },
  detailsText: {
    color: "grey",
    fontSize: 13,
    marginTop: 10,
    marginRight: 3,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingHorizontal: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "rgba(244, 235, 208, 0.5)",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: "#F4EBD0",
    fontSize: 16,
  },

  BigBox: {
    width: "94%",
    backgroundColor: "rgba(244,235,208,0.2)",
    borderRadius: 10,
    padding: 20,
    margin:'auto',
    justifyContent: "center",
  },
  boxHead1: {
    color: "#F4EBD0",
    fontSize: 15,
    marginTop: 5,
  },
  boxText1: {
    color: "#F4EBD0",
    fontSize: 18,
    marginTop: 5,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  box: {
    width: "45%",
    backgroundColor: "rgba(244,235,208,0.2)",
    borderRadius: 10,
    padding: 15,
  },
  boxHead: {
    color: "#F4EBD0",
    fontSize: 15,
    marginBottom: 10,
  },
  boxText: {
    color: "#F4EBD0",
    fontSize: 18,
    marginLeft:5
  },
  positiveChange: {
    color: "green",
    fontSize: 14,
  },
  negativeChange: {
    color: "red",
    fontSize: 14,
  },
  bottomSpacer: {
    height: 30, // Add this view to create space at the bottom
  },
});
