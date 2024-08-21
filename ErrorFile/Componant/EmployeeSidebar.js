import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Brandlogo from "../src/Brand_logo.png";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios'; 
import { LOGOUT } from '../Config/api';
import CustomAlert from '../Componant/CustomAlert'; 

const Sidebar = ({ sidebarAnimation, isSidebarVisible, toggleSidebar }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIcon, setAlertIcon] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("Token:", token); 

      const response = await axios.post(LOGOUT, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        await AsyncStorage.clear();
        setAlertMessage('Logout Successful!');
        setAlertIcon(require('../src/check.png')); 
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
          navigation.navigate('SignIn');
        }, 2000);
      }
    } catch (error) {
      console.error(error); 
      setAlertMessage('Logout Failed. Please try again.');
      setAlertIcon(require('../src/reject.png')); 
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 2000);
    }
  };

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          transform: [{ translateX: sidebarAnimation }],
        },
      ]}
    >
      <View style={styles.sidebarContent}>
        <View style={styles.abc}>
          <Image source={Brandlogo} style={styles.Brandlogo} />
          <TouchableOpacity style={styles.closebtn}>
            <Icon
              name="close"
              size={30}
              color="#F4EBD0"
              onPress={toggleSidebar}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sidebarItem}>
          <Icon name="view-dashboard" size={20} color="#F4EBD0" />
          <Text
            style={styles.sidebarItemText}
            onPress={() => navigation.navigate("EmployeeDash")}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <Icon name="home" size={20} color="#F4EBD0" />
          <Text
            style={styles.sidebarItemText}
            onPress={() => navigation.navigate("AllEmpProperty")}
          >
            All Properties
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sidebarItem}
         onPress={() => navigation.navigate("EmployeeLead")}>
          <Icon name="pencil" size={20} color="#F4EBD0" />
          <Text style={styles.sidebarItemText}>Leads</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sidebarItem}>
          <Icon name="account" size={20} color="#F4EBD0" />
          <Text
            style={styles.sidebarItemText}
            onPress={() => navigation.navigate("Properties")}
          >
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sidebarItem}
          onPress={handleLogout}
        >
          <Icon name="square-edit-outline" size={20} color="#F4EBD0" />
          <Text style={styles.sidebarItemTextLog}>Logout</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert 
        visible={alertVisible} 
        message={alertMessage} 
        onClose={() => setAlertVisible(false)} 
        imgSrc={alertIcon} 
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "80%",
    backgroundColor: "#1A1A1A",
    padding: 20,
    zIndex: 1000,
    borderTopRightRadius: 20,
  },
  sidebarContent: {
    flex: 1,
    marginTop: 25,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  sidebarItemText: {
    color: "#F4EBD0",
    fontSize: 18,
    marginLeft: 10,
  },
  sidebarItemTextLog: {
    color: "red",
    fontSize: 18,
    marginLeft: 10,
  },
  
  
  closebtn: {
    padding: 10,
  },
  abc: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Brandlogo: {
    height: 70,
    width: 120,
    marginBottom: 15,
  },
});

export default Sidebar;
