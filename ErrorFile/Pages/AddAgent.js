import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CREATE_EMPLOYEE } from "../Config/api"; 
import CustomAlert from "../Componant/CustomAlert";


const AddAgent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertImage, setAlertImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSave = async () => {
    if (password !== confirmPwd) {
      setAlertMessage("Passwords do not match");
      setAlertImage(require("../src/cross.png")); 
      setAlertVisible(true);
      return;
    }
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken"); 
      console.log(token)
      const response = await axios.post(
        CREATE_EMPLOYEE,
        {
          firstName,
          lastName,
          email,
          password,
          confirmPwd,
          roleName: "employee",
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.error) {
        setAlertMessage("Failed to create agent");
        setAlertImage(require("../src/cross.png")); 
        setAlertVisible(true);
      } else {
        setAlertMessage("Agent created successfully");
        setAlertImage(require("../src/check.png"));
        setAlertVisible(true);
        setTimeout(() => {
          navigation.navigate("AgentOTPvarify", { email });
        }, 1500);   
      }
    } catch (error) {
      setAlertMessage("An error occurred while creating the agent");
      setAlertImage(require("../src/cross.png")); 
      setAlertVisible(true);
    }finally {
      setLoading(false); 
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={30} color="#D6AD60" />
          </TouchableOpacity>
          <Text style={styles.heading}>Add Agent:</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#B0B0B0"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#B0B0B0"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            placeholderTextColor="#B0B0B0"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#B0B0B0"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              placeholderTextColor="#B0B0B0"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconContainer}
            >
              <Icon
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="#D6AD60"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#B0B0B0"
              value={confirmPwd}
              onChangeText={setConfirmPwd}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.iconContainer}
            >
              <Icon
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={24}
                color="#D6AD60"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSave}
            disabled={loading} 
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
          imgSrc={alertImage}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#122620", // Background color for the entire screen
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  heading: {
    fontSize: 20,
    color: "#D6AD60",
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D6AD60",
  },
  label: {
    color: "#D6AD60",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 40,
    backgroundColor: "#1E2A2A",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    borderColor: "#D6AD60",
    borderWidth: 1,
    backgroundColor: "#1E2A2A",
    width: "45%",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#D6AD60",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#D6AD60",
    width: "45%",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#122620",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddAgent;
