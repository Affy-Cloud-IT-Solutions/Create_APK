import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const EditProperties = () => {
  const navigation = useNavigation(); // Get navigation object

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
          <Text style={styles.heading}>Edit Property:</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            placeholderTextColor="#B0B0B0" // Adjust placeholder color here
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter City"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Pincode"
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Number of Bedrooms</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Number of Bedrooms"
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Agent Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Agent Name"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Add Amenity</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Amenity"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Description"
            multiline
            numberOfLines={4}
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Floors</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Number of Floors"
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter State"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Latitude"
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Number of Bathrooms</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Number of Bathrooms"
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Agent Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Agent Phone"
            keyboardType="phone-pad"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Add Nearby Place</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Nearby Place"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text
              style={styles.cancelButtonText}
              onPress={() => navigation.goBack()}
              >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#122620", 
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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

  input: {
    height: 40,
    // color: 'white',
    backgroundColor: "#1E2A2A",
    paddingHorizontal: 10,
    borderRadius: 5,
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
  backButton: {
    marginRight: 10,
  },
});

export default EditProperties;
