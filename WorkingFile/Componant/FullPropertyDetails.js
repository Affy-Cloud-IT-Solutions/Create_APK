import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_ONE_PROPERTY } from '../Config/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import backIcon from '../src/back.png';

export default function FullPropertyDetails() {
  const [property, setProperty] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { propertyId } = route.params;

  useEffect(() => {
    const fetchPropertyDetails = async () => {
        try {
            const response = await axios.get(`${USER_ONE_PROPERTY}${propertyId}`);
            setProperty(response.data.meta.property); 
        } catch (error) {
            console.error('Error fetching property details:', error);
        }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  const handleBackPress = () => {
    navigation.goBack();
    return true; // Prevent default behavior (i.e., exiting the app)
  };

  useEffect(() => {
    // Add event listener for hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Clean up the event listener on unmount
    return () => backHandler.remove();
  }, []);

  const getIconName = (amenity) => {
    switch (amenity) {
        case 'Swimming Pool':
            return 'tint';
        case 'Gym':
            return 'heartbeat';
        case 'Parking':
            return 'car';
        default:
            return 'check';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Property Details</Text>
      </View>

      <View style={styles.infoContainer}>
        {/* Title and Price */}
        <View style={styles.row}>
          <Text style={styles.name}>{property.title}</Text>
        </View>
        <View style={styles.row}>         
          <Text style={styles.prize}>₹ {property.price || 'Price not available'}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.subHeading}>Description</Text>
          <Text style={styles.description}>
            {property.description}
          </Text>
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.subHeading}>Property Details</Text>
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={20} color="#fff" />
            <Text style={styles.detailsText}>Location : {property.city} , {property.country}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="arrows-alt" size={16} color="#fff" />
            <Text style={styles.detailsText}>Area: {property.area} sq. ft.</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color="#fff" />
            <Text style={styles.detailsText}>Construction Year: {property.constructionYear}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="bed" size={16} color="#fff" />
            <Text style={styles.detailsText}>Bedrooms: {property.numberOfBathrooms}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="bath" size={16} color="#fff" />
            <Text style={styles.detailsText}>Bathrooms: {property.numberOfBedrooms}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="building" size={16} color="#fff" />
            <Text style={styles.detailsText}>Floor: {property.floor}</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
                        <Text style={styles.subHeading}>Amenities</Text>
                        {property.amenities && property.amenities.map((amenity, index) => (
                            <View style={styles.detailRow} key={index}>
                                <Icon name={getIconName(amenity)} size={15} style={styles.detailIcon} />
                                <Text style={styles.detailsText}>{amenity}</Text>
                            </View>
                        ))}
                    </View>

         {/* Nearby Places */}
         <View style={styles.section}>
          <Text style={styles.subHeading}>Nearby Places</Text>
          {property.nearbyPlaces && property.nearbyPlaces.map((place, index) => (
            <View style={styles.detailRow} key={index}>
              <Icon name="map-marker" size={16} color="#fff" />
              <Text style={styles.detailsText}>{place}</Text>
            </View>
          ))}
        </View>

        {/* Agent Details */}
        <View style={[styles.section, styles.centeredSection]}>
          <Text style={[styles.subHeading, styles.centeredText]}>Agent Details</Text>
          <View style={[styles.detailRow, styles.centeredDetailRow]}>            
            <Text style={[styles.detailsText1, styles.centeredText]}>Name:{property.agentName}</Text>
          </View>
          <View style={[styles.detailRow, styles.centeredDetailRow]}>           
            <Text style={[styles.detailsText1, styles.centeredText]}>Email: {property.agentEmail}</Text>
          </View>
          <View style={[styles.detailRow, styles.centeredDetailRow]}>            
            <Text style={[styles.detailsText1, styles.centeredText]}>Phone: {property.agentPhone}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122620',
    padding: 12,
  },
  backIcon: {
    width: 25,
    height: 20,
    tintColor: '#ccc',
  },
  headerContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    color: '#fff',
    position: 'absolute'
  },
  detailIcon:{
    color:'#fff'

  },
  title: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  infoContainer: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
  },
  prize: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
  },
  subHeading: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    borderBottomWidth:1,
    borderColor:'#FFFFFF33',
    paddingVertical:5
  },
  detailsText: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  detailsText1: {
    color: '#ccc',
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 15,
  },
  centeredSection: {
    alignItems: 'center',
  },
  centeredDetailRow: {
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});
