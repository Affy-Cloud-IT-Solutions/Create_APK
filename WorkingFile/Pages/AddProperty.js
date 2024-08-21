import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Button,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../Componant/CustomAlert'; 
import { CREATE_PROPERTY } from "../Config/api";

const AddProperties = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [discountprice, setDiscountPrice] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [description, setDescription] = useState('');
  const [floors, setFloors] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [constructionYear, setConstructionYear] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [amenity, setAmenity] = useState('');
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [nearbyPlace, setNearbyPlace] = useState('');
  const [nearbyPlacesList, setNearbyPlacesList] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertImage, setAlertImage] = useState(null);

  const handleAddAmenity = () => {
    if (amenity.trim()) {
      setAmenitiesList([...amenitiesList, amenity.trim()]);
      setAmenity('');
    }
  };

  const handleRemoveAmenity = (index) => {
    const updatedAmenities = amenitiesList.filter((_, i) => i !== index);
    setAmenitiesList(updatedAmenities);
  };

  const handleAddNearbyPlace = () => {
    if (nearbyPlace.trim()) {
      setNearbyPlacesList([...nearbyPlacesList, nearbyPlace.trim()]);
      setNearbyPlace('');
    }
  };

  const handleRemoveNearbyPlace = (index) => {
    const updatedNearbyPlaces = nearbyPlacesList.filter((_, i) => i !== index);
    setNearbyPlacesList(updatedNearbyPlaces);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setAlertMessage('We need access to your media library to pick images.');
      setAlertImage(require('../src/access.png')); 
      setAlertVisible(true);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (!title || !price || !discountprice || !city || !pincode || !bedrooms || !area || !agentName || ! agentEmail || !description || !floors || !state || !country ||!constructionYear || !latitude || !longitude || !bathrooms || !agentPhone) {
      setAlertMessage('Please fill out all required fields.');
      setAlertImage(require('../src/cross.png')); 
      setAlertVisible(true);
      return;
    }
  
    setLoading(true);
    try {
      console.log('Starting submission...');
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('discountPrice', discountprice);
      formData.append('city', city);
      formData.append('pincode', pincode);
      formData.append('numberOfBedrooms', bedrooms);
      formData.append('agentName', agentName);
      formData.append('agentPhone', agentPhone);
      formData.append('agentEmail', agentEmail);
      formData.append('floor', floors);
      formData.append('state', state);
      formData.append('country', country);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('area', area);
      formData.append('constructionYear', constructionYear);
      formData.append('numberOfBathrooms', bathrooms);
      formData.append('category', "60d21b4667d0d8992e610c86");
      formData.append('subCategory', "60d21b4667d0d8992e610c87");
      formData.append('amenities', JSON.stringify(amenitiesList));
      formData.append('nearbyPlaces', JSON.stringify(nearbyPlacesList));
  
      console.log('Form data:', formData);
  
      images.forEach((image, index) => {
        formData.append('images', {
          uri: image,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      });
  
      const Token = await AsyncStorage.getItem('userToken');  
      const response = await axios.post(CREATE_PROPERTY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Token}`,
        },
      });
  
      console.log('API Response:', response.data);  
      setAlertMessage('Property added successfully!');
      setAlertImage(require('../src/check.png')); 
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setAlertMessage('Failed to add property.');
      setAlertImage(require('../src/reject.png')); 
      setAlertVisible(true);
    } finally {
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
          <Text style={styles.heading}>Add Property:</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Title"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Price"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={price}
            onChangeText={setPrice}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}> Discount Price</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Price"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={discountprice}
            onChangeText={setDiscountPrice}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter City"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter State"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={state}
            onChangeText={setState}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Country"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={country}
            onChangeText={setCountry}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Pincode"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={pincode}
            onChangeText={setPincode}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Number of Bedrooms</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Number of Bedrooms"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={bedrooms}
            onChangeText={setBedrooms}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Number of Bathrooms</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Number of Bathrooms"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={bathrooms}
            onChangeText={setBathrooms}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>construction Year</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter construction Year"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={constructionYear}
            onChangeText={setConstructionYear}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Latitude"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={latitude}
            onChangeText={setLatitude}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Longitute</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter longitude"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={longitude}
            onChangeText={setLongitude}
          />
        </View>


        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Description"
            multiline
            numberOfLines={4}
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={description}
            onChangeText={setDescription}

          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Area</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Area"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={area}
            onChangeText={setArea}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Floors</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Number of Floors"
            keyboardType="numeric"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={floors}
            onChangeText={setFloors}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Agent Name</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Agent Name"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={agentName}
            onChangeText={setAgentName}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Agent Phone</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Agent Phone"
            keyboardType="phone-pad"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={agentPhone}
            onChangeText={setAgentPhone}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Agent Email</Text>
          <TextInput
            style={[styles.input, { color: 'white' }]}
            placeholder="Enter Agent email"
            keyboardType="email-address"
            placeholderTextColor="rgba(244, 235, 208, 0.6)"
            value={agentEmail}
            onChangeText={setAgentEmail}
          />
        </View>


        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Add Amenity</Text>
          <View style={styles.amenityInputContainer}>
            <TextInput
              style={[styles.input, { color: 'white' }]}
              placeholder="Enter Amenity"
              value={amenity}
              onChangeText={setAmenity}
              placeholderTextColor="rgba(244, 235, 208, 0.6)"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddAmenity}>
              <Icon name="plus" size={24} color="#D6AD60" />
            </TouchableOpacity>
          </View>
          {amenitiesList.length > 0 && (
            <View style={styles.amenitiesList}>
              {amenitiesList.map((item, index) => (
                <View key={index} style={styles.amenityItemContainer}>
                  <Text style={styles.amenityItem}>{item}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveAmenity(index)}
                  >
                    <Icon name="close" size={18} color="#D6AD60" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Add Nearby Place</Text>
          <View style={styles.amenityInputContainer}>
            <TextInput
              style={[styles.input, { color: 'white' }]}
              placeholder="Enter Nearby Place"
              value={nearbyPlace}
              onChangeText={setNearbyPlace}
              placeholderTextColor="rgba(244, 235, 208, 0.6)"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddNearbyPlace}
            >
              <Icon name="plus" size={24} color="#D6AD60" />
            </TouchableOpacity>
          </View>
          {nearbyPlacesList.length > 0 && (
            <View style={styles.amenitiesList}>
              {nearbyPlacesList.map((item, index) => (
                <View key={index} style={styles.amenityItemContainer}>
                  <Text style={styles.amenityItem}>{item}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveNearbyPlace(index)}
                  >
                    <Icon name="close" size={18} color="#D6AD60" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Upload Images</Text>
          <Button title="Pick Images" onPress={pickImage} />
          {images.length > 0 && (
            <View style={styles.imagesContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Icon name="close" size={18} color="#D6AD60" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        imgSrc={alertImage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  removeButton: {
    marginLeft: 10,
  },
  imagesContainer: {
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  removeImageButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
  amenityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#1E2A2A",
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#fff",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#1E2A2A",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  amenitiesList: {
    marginTop: 10,
  },
  amenityItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E2A2A",
    borderRadius: 5,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  amenityItem: {
    color: "#D6AD60",
    fontSize: 16,
    flex: 1, 
  },
  removeButton: {
    marginLeft: 10, 
  },
  input: {
    height: 40,   
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

export default AddProperties;
