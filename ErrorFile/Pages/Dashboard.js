import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Modal,
  Vibration,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import filter from "../src/filter.png";
import cogIcon from "../src/down.png";
import BottomNavbar from "../Componant/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ALL_PROPERTIES, SEARCH_PROPERTY, WISH_LIST } from "../Config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPropertyTypeModalVisible, setIsPropertyTypeModalVisible] =
    useState(false);
  const [isPricePopupVisible, setPricePopupVisible] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isAmenitiesPopupVisible, setAmenitiesPopupVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(ALL_PROPERTIES);
        const userId = await AsyncStorage.getItem("userId");
        setProperties(response.data.meta.properties);

        // Initialize wishlist status for all properties
        const initialWishlistStatus = {};
        response.data.meta.properties.forEach((property) => {
          initialWishlistStatus[property._id] = property.whishlist || false;
        });
        setWishlistStatus(initialWishlistStatus);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleCardPress = (id) => {
    navigation.navigate("Prodetail", { propertyId: id });
  };



  const handleLikePress = async (id) => {
  // Optimistically update UI by toggling the status
  const currentStatus = wishlistStatus[id];
  const newLikedStatus = !currentStatus;
  setWishlistStatus({ ...wishlistStatus, [id]: newLikedStatus });
  Vibration.vibrate(100);

  try {
    // Get the token from AsyncStorage
    const token = await AsyncStorage.getItem("userToken");

    // Include the token in the headers
    const response = await axios.post(
      WISH_LIST + id,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming Bearer token authentication
        },
      }
    );

    if (response.data.success) {
      console.log("4567",response.data)
      setWishlistStatus({
        ...wishlistStatus,
        [id]: response.data.data.whishlist,
      });
    } else {
      // Revert the change if the update fails
      setWishlistStatus({ ...wishlistStatus, [id]: currentStatus });
    }
  } catch (error) {
    console.error("Error updating wishlist status:", error);
    setWishlistStatus({ ...wishlistStatus, [id]: currentStatus });
  }
};


  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const togglePropertyTypeModal = () => {
    setIsPropertyTypeModalVisible(!isPropertyTypeModalVisible);
  };

  const handlePriceButtonPress = () => {
    setPricePopupVisible(true);
  };

  const closePricePopup = () => {
    setPricePopupVisible(false);
  };

  const handleApplyPrice = () => {
    // Implement your logic to apply the price filter here
    closePricePopup();
  };

  const handleApplyAmenities = () => {
    // Implement your logic to apply the amenities filter here
    closeAmenitiesPopup();
  };

  const handleAmenitiesButtonPress = () => {
    setAmenitiesPopupVisible(true);
  };

  const closeAmenitiesPopup = () => {
    setAmenitiesPopupVisible(false);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const url =
          searchValue.length >= 3
            ? `${SEARCH_PROPERTY}?searchValue=${searchValue}`
            : ALL_PROPERTIES;
        const response = await axios.get(url);
        setProperties(
          response.data.meta
            ? response.data.meta.properties
            : response.data.data
        );
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [searchValue]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={15} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties..."
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate("Filter")}
          >
            <Image source={filter} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterarea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.button} onPress={toggleModal}>
              <Text style={styles.buttonText}>BUY</Text>
              <Image source={cogIcon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={togglePropertyTypeModal}
            >
              <Text style={styles.buttonText}>Property Type</Text>
              <Image source={cogIcon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePriceButtonPress}
            >
              <Text style={styles.buttonText}>Price</Text>
              <Image source={cogIcon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleAmenitiesButtonPress}
            >
              <Text style={styles.buttonText}>Amenities</Text>
              <Image source={cogIcon} style={styles.icon} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Scrollable cards */}
        <ScrollView contentContainerStyle={styles.cardsContainer}>
          {properties.map((property) => (
            <TouchableOpacity
              key={property._id}
              onPress={() => handleCardPress(property._id)}
              style={styles.card}
            >
              <Image
                source={{ uri: property.images[0] }}
                style={styles.cardImage}
              />
              <TouchableOpacity
              onPress={() => handleLikePress(property._id)}
              style={[
                styles.heartIcon,
                wishlistStatus[property._id]
                  ? styles.likedIcon
                  : styles.unlikedIcon,
              ]}
            >
              <Icon
                name="heart"
                size={24}
                color={wishlistStatus[property._id] ? "red" : "gray"}
              />
            </TouchableOpacity>
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
                <TouchableOpacity style={styles.button1}>
                  <Icon name="phone" size={18} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button1}>
                  <Icon name="whatsapp" size={18} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button1}
                  onPress={() => navigation.navigate("ThreeModel")}
                >
                  <Icon name="cube" size={18} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>3D View</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Option</Text>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>RENT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Property Type Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPropertyTypeModalVisible}
        onRequestClose={togglePropertyTypeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Property Type</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={togglePropertyTypeModal}
            >
              <Text style={styles.modalButtonText}>Residential</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={togglePropertyTypeModal}
            >
              <Text style={styles.modalButtonText}>Commercial</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Price Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPricePopupVisible}
        onRequestClose={closePricePopup}
      >
        <View style={styles.pricePopupContainer}>
          <View style={styles.pricePopupContent}>
            <Text style={styles.pricePopupTitle}>Set Price Range</Text>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min Price"
                value={minPrice}
                onChangeText={(text) => setMinPrice(text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.priceInput}
                placeholder="Max Price"
                value={maxPrice}
                onChangeText={(text) => setMaxPrice(text)}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyPrice}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Amenities Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAmenitiesPopupVisible}
        onRequestClose={closeAmenitiesPopup}
      >
        <View style={styles.amenitiesPopupContainer}>
          <View style={styles.amenitiesPopupContent}>
            <Text style={styles.amenitiesPopupTitle}>Select Amenities</Text>
            <TouchableOpacity
              style={styles.amenitiesPopupButton}
              onPress={handleApplyAmenities}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavbar />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#122620",
  },
  container: {
    flex: 1,
    backgroundColor: "#122620",
  },
  searchFilterContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "85%",
  },
  searchIcon: {
    width: 15,
    height: 15,
  },
  filterButton: {
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    width: 18,
    height: 18,
  },
  searchInput: {
    flex: 1,
    height: 35,
    marginLeft: 10,
    marginRight: 10,
  },
  filterarea: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#fff",
    marginRight: 10,
    borderRadius: 5,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    gap: 5,
  },
  button1: {
    backgroundColor: "#fff",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    height: 40,
  },
  icon: {
    width: 15,
    height: 15,
  },
  buttonText: {
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 15,
    overflow: "hidden",
    height: 350,
    marginBottom: 5,
    marginTop: 10,
    position: 'relative'
  },
  heartIcon: {
    position: 'absolute',
    top: 15,
    right: 20,
    color:'gray'
  },
  likedIcon: {
    color: 'red',
},
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
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
    marginTop: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    gap: 8,
  },
  bottomNavbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButton1: {
    backgroundColor: "#F4EBD0",
    padding: 10,
    borderRadius: 30,
    marginVertical: 5,
    width: "50%",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
  },

  popupContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popupContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  priceInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "48%",
  },
  popupButton: {
    backgroundColor: "#F4EBD0",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  popupButtonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Dashboard;
