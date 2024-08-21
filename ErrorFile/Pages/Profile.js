import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  BackHandler
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import bg from "../src/backimg.png";
import BottomNavbar from '../Componant/BottomNavbar';
import { useNavigation } from '@react-navigation/native';
import { USER_DETAILS, LOGOUT } from '../Config/api';
import backIcon from '../src/back.webp';
import CustomAlert from '../Componant/CustomAlert'; 

const Profile = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [profile, setProfile] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); 
  const [alertIcon, setAlertIcon] = useState(null); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`${USER_DETAILS}/${userId}`);
          setProfile(response.data.meta.user);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    // Cleanup the event listener
    return () => backHandler.remove();
  }, []);
  

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');  
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
      setAlertMessage('Logout Failed. Please try again.');
      setAlertIcon(require('../src/reject.png')); 
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 2000);
    }
  };

  return (
    <ImageBackground source={bg} style={styles.background}>
       <CustomAlert 
        visible={alertVisible} 
        message={alertMessage} 
        onClose={() => setAlertVisible(false)} 
        imgSrc={alertIcon} 
      />
      <View style={styles.container}>
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={backIcon} style={styles.backIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topButtonRight}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headingcontainer}>
          <Text style={styles.heading}>{profile.firstName} {profile.lastName}</Text>
        </View>
        <View style={styles.infoheadingContainer}>
          <Text style={styles.infoheading}>Email:</Text>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="envelope" size={15} color="#fff" />
          <Text style={styles.infoText}>{profile.email}</Text>
        </View>

        <View style={styles.infoheadingContainer}>
          <Text style={styles.infoheading}>Contact:</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="phone" size={20} color="#fff" />
          <Text style={styles.infoText}>{profile.phoneNumber}</Text>
        </View>

        <View style={styles.infoheadingContainer}>
          <Text style={styles.infoheading}>Gender:</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="male" size={20} color="#fff" />
          <Text style={styles.infoText}>{profile.gender}</Text>
        </View>

        <View style={styles.infoheadingContainer}>
          <Text style={styles.infoheading}>Date Of Birth:</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="calendar" size={15} color="#fff" />
          <Text style={styles.infoText}>{profile.age}</Text>
        </View>
        <View style={styles.separator}></View>

        <View style={styles.abc}>
          <TouchableOpacity style={styles.changePasswordContainer}
           onPress={() => navigation.navigate('ChangePassword')}>
            <Icon name="key" size={20} color="#ccc" />
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.SecondContainer}>
              <Icon name="info-circle" size={22} color="#ccc" />
              <Text style={styles.SecondContainerText}>About Us</Text>
            </View>
          </TouchableOpacity>

          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer1}>
                <TouchableOpacity
                  style={styles.option}
                >
                  <Text style={styles.optionText}>Terms of Use</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option1}
                >
                  <Text style={styles.optionText}>Privacy & Policy</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>

        <TouchableOpacity onPress={() => setHelpModalVisible(true)}>
          <View style={styles.SecondContainer}>
            <Icon name="question-circle" size={22} color="#fff" />
            <Text style={styles.SecondContainerText}>Need Help?</Text>
          </View>
        </TouchableOpacity>
        
        <Modal
          transparent={true}
          animationType="slide"
          visible={helpModalVisible}
          onRequestClose={() => setHelpModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setHelpModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.helpModalTitle}>Need Help?</Text>

              <TouchableOpacity style={styles.helpOption}>
                <Icon name="bug" size={20} color="#333" />
                <View style={styles.helpOptionTextContainer}>
                  <Text style={styles.helpOptionTitle}>Report a Bug</Text>
                  <Text style={styles.helpOptionDescription}>If you encounter any issues, please let us know.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.helpOption}>
                <Icon name="lightbulb-o" size={20} color="#333" />
                <View style={styles.helpOptionTextContainer}>
                  <Text style={styles.helpOptionTitle}>Suggest an Improvement</Text>
                  <Text style={styles.helpOptionDescription}>Share your ideas on how we can improve.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.endContainer}>
            <Icon name="power-off" size={20} color="#C40C0C" />
            <Text style={styles.LogoutText}>Log-Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <BottomNavbar />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  modalContainer1: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "75%",
    elevation: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical:10
  },
  option1:{
    padding: 10,
    paddingVertical:10
  },
  optionText: {
    fontSize: 17,
    color: "#333",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingcontainer: {
    alignItems: "center",
    marginTop: 15,
  },
  heading: {
    fontSize: 25,
    color: "#F4EBD0",
    fontWeight:'bold',
    marginBottom: 30,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#F4EBD0",
    marginLeft: 15,
  },
  topButton: {
    fontSize: 17,
  },
  topButtonRight: {
    fontSize: 17,
  },
  editButtonText: {
    fontSize: 17,
    color: "#ccc",
    fontWeight: "bold",
  },
  infoheadingContainer: {
    marginTop: 15,
  },
  infoheading: {
    fontSize: 13,
    color: "#ccc",
  },
  endContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  endContainerText: {
    fontSize: 20,
    color: "#F4EBD0",
    marginLeft: 20,
  },
  LogoutText: {
    fontSize: 18,
    color: "#C40C0C",
    fontWeight: 'bold',
    marginLeft: 20,
  },
  SecondContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  SecondContainerText: {
    fontSize: 17,
    color: "#F4EBD0",
    marginLeft: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginVertical: 10,
    width: "100%",
  },
  changePasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom:10
  },
  changePasswordText: {
    fontSize: 17,
    color: "#F4EBD0",
    marginLeft: 20,
  },
  helpModalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  helpOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  helpOptionTextContainer: {
    marginLeft: 10,
    marginBottom: 5,
  },
  helpOptionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "#333",
    paddingHorizontal: 9,
  },
  helpOptionDescription: {
    fontSize: 13,
    color: "#666",
    paddingHorizontal: 10,
  },
  closeModalText: {
    marginTop: 15,
    fontSize: 16,
    color: "#007BFF",
    textAlign: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#ccc',
},
});

export default Profile;
