import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { UPDATE_EMPLOYEE } from "../Config/api"; 

const UpdateAgent = ({ route }) => {
  const navigation = useNavigation();
  const { agent } = route.params; 
  console.log("id",agent._id)

  const [firstName, setFirstName] = useState(agent.firstName || "");
  const [lastName, setLastName] = useState(agent.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(agent.phoneNumber || "");
  const [email, setEmail] = useState(agent.email || "");

  const handleUpdate = async () => {
    try {
        console.log(response)
      const response = await axios.put(`${UPDATE_EMPLOYEE}${agent._id}`, {
        firstName,
        lastName,
        phoneNumber,
        email,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Agent updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update agent. Please try again.");
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
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
          <Text style={styles.heading}>Update Agent:</Text>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.submitButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
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

export default UpdateAgent;
