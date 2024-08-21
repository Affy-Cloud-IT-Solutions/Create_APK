import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, BackHandler, Vibration } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import BottomNavbar from '../Componant/BottomNavbar';
import { GET_WISH_LIST, WISH_LIST } from '../Config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishList = ({ navigation }) => {
  const [wishlistData, setWishlistData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const handleLikePress = async (id) => {
    const newLikedStatus = !liked[id];
    setLiked((prev) => ({ ...prev, [id]: newLikedStatus }));
    Vibration.vibrate(100);

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.post(
        WISH_LIST + id,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log('Wishlist status updated successfully');
        // Update the wishlistData state accordingly
        setWishlistData((prevWishlistData) =>
          prevWishlistData.filter((property) => property._id !== id)
        );
      } else {
        // Revert the change if the update fails
        setLiked((prev) => ({ ...prev, [id]: !newLikedStatus }));
      }
    } catch (error) {
      console.error("Error updating wishlist status:", error);
      setLiked((prev) => ({ ...prev, [id]: !newLikedStatus }));
    }
  };

  const fetchWishlistData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(GET_WISH_LIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlistData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      // console.error("Error fetching wishlist data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack(); 
        return true; 
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!wishlistData.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.emptyState}>
          <Icon name="heart" size={50} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No saved properties found.</Text>
          <Text style={styles.emptyText1}>Start adding your favorite homes and stay updated on contracted agents and much more.</Text>
          <TouchableOpacity style={styles.dashboardButton} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.dashboardButtonText}>Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.bottomNavbar}>
          <BottomNavbar />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Saved Properties</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {wishlistData.map((property) => (
          <TouchableOpacity
            key={property._id}
            style={styles.card}
            onPress={() => navigation.navigate('Prodetail', { propertyId: property._id })}
          >
            <TouchableOpacity style={styles.closeButton} onPress={() => handleLikePress(property._id)}>
              <Icon name="close" size={18} style={styles.closeIcon} />
            </TouchableOpacity>
            <Image
              source={{ uri: property.images.length > 0 ? property.images[0] : 'https://example.com/default-image.jpg' }} // Replace with a valid default image URL
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{property.title}</Text>
              </View>
            </View>
            <Text style={styles.prize}>₹ {property.price}</Text>
            <View style={styles.locationContainer}>
              <Icon name="map-marker" size={20} style={styles.locationIcon} />
              <Text style={styles.locationText}>{property.city}, {property.state}, {property.country}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button}>
                <Icon name="phone" size={20} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon name="whatsapp" size={20} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon name="cube" size={20} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>3D View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.bottomNavbar}>
        <BottomNavbar />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122620',
  },
  headerContainer: {
    backgroundColor: '#122620',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccc',
  },
  scrollView: {
    flex: 1,
    marginTop: 5,
    paddingHorizontal: 15,
  },
  scrollViewContent: {
    paddingBottom: 60, 
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'relative',
    marginTop: 15,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#555',
    fontWeight: 'bold',
  },
  prize: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    color: '#333',
    paddingHorizontal: 8,
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    gap: 8,
  },
  button: {
    backgroundColor: '#fff',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    height: 40,
  },
  buttonIcon: {
    color: '#333',
    marginRight: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: '#ccc',
    padding: 2,
    width: 23,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeIcon: {
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    color: '#ccc',
  },
  emptyText: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 10,
  },
  emptyText1: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 5,
    textAlign: 'center',
  },
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#122620',
  },
  dashboardButton: {
    backgroundColor: '#D6AD60',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: 20,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WishList;
