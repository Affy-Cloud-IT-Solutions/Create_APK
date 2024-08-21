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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALL_EMPLOYEE_PROPERTY, DELETE_PROPERTY } from "../Config/api"; // Update the import to use the new API endpoint
import CustomAlert from "../Componant/CustomAlert";

const AllEmployeeProperty = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertImage, setAlertImage] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(ALL_EMPLOYEE_PROPERTY, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties(response.data.meta); 
      // console.log("AllData1", response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      setAlertMessage("Error loading properties. Please try again later.");
      setAlertImage(require("../src/reject.png"));
      setAlertVisible(true);
    }
  };

  const deleteProperty = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("Token not found");
      }

      await axios.delete(`${DELETE_PROPERTY}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties(properties.filter(property => property._id !== id));
      setAlertMessage("Property deleted successfully!");
      setAlertImage(require("../src/check.png"));
      setAlertVisible(true)
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    } catch (err) {
      setAlertMessage("Failed to delete the property.");
      setAlertImage(require("../src/reject.png"));
      setAlertVisible(true);
    }
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
          <Text style={styles.heading}>All Properties</Text>
        </View>
        <TouchableOpacity
          style={styles.addPropertyButton}
          onPress={() => navigation.navigate("AddEmpProperty")}
        >
          <Text style={styles.addPropertyText}>+ Add Property</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
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
                onPress={() => navigation.navigate("EditProperties", { propertyId: property._id })}
              >
                <Icon
                  name="square-edit-outline"
                  size={20}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button1}
                onPress={() => deleteProperty(property._id)}
              >
                <Icon name="delete" size={20} style={styles.buttonIcon} color="red" />
                <Text style={styles.buttonText2}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
    backgroundColor: "#122122",
  },
  addPropertyButton: {
    backgroundColor: "transparent",
    borderColor: "#F4EBD0",
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addPropertyText: {
    color: "#F4EBD0",
    fontSize: 14,
  },
  backButton: {
    padding: 20,
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
    fontSize: 20,
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
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    gap: 5,
  },
  buttonText: {
    color: "#000",
  },
  buttonText2: {
    color: "red",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    height: 350,
    width: '90%',
    margin: 'auto',
    marginTop: 15,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 175,
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cardTitle: {
    color: "#555",
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#555",
  },
  prize: {
    paddingHorizontal: 10,
    fontSize: 22,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 10,
  },
  locationIcon: {
    color: "#555",
    marginRight: 5,
  },
  locationText: {
    color: "#555",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },

});

export default AllEmployeeProperty;
