import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  BackHandler 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { GET_ALL_EMPLOYEE} from '../Config/api'; 

export default function AllAgents() {
  const navigation = useNavigation();
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(GET_ALL_EMPLOYEE);
        console.log("khalid",response.data)
        setAgents(response.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();

    if (Platform.OS === 'android') {
      const backAction = () => {
        navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }
  }, [navigation]);

 const handleEdit = (agent) => {
  navigation.navigate('UpdateAgent', { agentId: agent._id ,agent  });
};
  

  const renderItem = ({ item }) => (
    <View style={styles.agentContainer}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.agentName}>{item.firstName} {item.lastName}</Text>
      
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.agentEmail}>{item.email}</Text>
      
      <Text style={styles.label}>Phone Number:</Text>
      <Text style={styles.agentPhone}>+91 {item.phoneNumber}</Text>
  
      <TouchableOpacity onPress={() => handleEdit(item)}>
        <Icon name="pencil" size={24} color="#D6AD60" />
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Agents</Text>
      </View>
      <FlatList
        data={agents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122620',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128,0.5)",
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 10,
  },
  agentContainer: {
    backgroundColor: "rgba(128, 128, 128,0.4)",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  label: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 2,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#D6AD60',
  },
  agentEmail: {
    fontSize: 15,
    color: '#D6AD60',
    marginBottom: 10,
  },
  agentPhone: {
    fontSize: 15,
    color: '#D6AD60',
  },
});
