import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet, 
  ImageBackground, 
  BackHandler, 
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { LEAD_FIELD } from '../Config/api';

const LeadGenrate = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(LEAD_FIELD, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!data.error) {
          setFields(data.meta);
        } else {
          console.error('Error fetching fields:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleInputChange = (fieldId, value) => {
    setInputValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSelect = (fieldId, option) => {
    setSelectedValue(prev => ({ ...prev, [fieldId]: option }));
    setModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Form submitted with values: ", { ...inputValues, ...selectedValue });
    // Handle form submission logic here
  };

  const openModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground 
      source={require('../src/backimg.png')} 
      style={styles.backgroundImage}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#D6AD60" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Fill the Form</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>
          Fill out the form to explore personalized real estate options and find your perfect property.
        </Text>

        {fields.map(field => {
          if (field.type === 'input') {
            return (
              <View key={field._id} style={styles.fieldContainer}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  placeholder={field.label}
                  placeholderTextColor="rgba(244,235,208,0.5)"
                  style={styles.input}
                  value={inputValues[field._id] || ''}
                  onChangeText={(text) => handleInputChange(field._id, text)}
                />
              </View>
            );
          }

          if (field.type === 'dropdown' && field.options.length > 0) {
            return (
              <View key={field._id} style={styles.fieldContainer}>
                <Text style={styles.label}>{field.label}</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => openModal(field)}
                >
                  <Text 
                    style={[
                      styles.dropdownText, 
                      !selectedValue[field._id] && { color: "rgba(244,235,208,0.5)" } 
                    ]}
                  >
                    {selectedValue[field._id] || `Select ${field.label}`}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" style={styles.dropdownIcon} />
                </TouchableOpacity>
              </View>
            );
          }

          return null;
        })}

        {modalVisible && currentField && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {currentField.options.length > 0 ? (
                  <FlatList
                    data={currentField.options}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalOption}
                        onPress={() => handleSelect(currentField._id, item)}
                      >
                        <Text style={styles.optionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text style={styles.noOptionsText}>No options available</Text>
                )}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 22,
    color: '#D6AD60',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    padding: 30,
  },
  headerText: {
    fontSize: 16,
    color: '#D6AD60',
    marginBottom: 10,
  },
  fieldContainer: {
    marginVertical: 8,
    width: '95%',
  },
  label: {
    fontSize: 13,
    color: '#D6AD60',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#666',
    fontSize: 15,
    flex: 1,
    textAlign: 'left', 
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noOptionsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    padding: 15,
  },
  modalCloseButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#D6AD60',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    width: '60%',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LeadGenrate;
