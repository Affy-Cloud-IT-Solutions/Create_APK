import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const CustomCheckBox = ({ isChecked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkBoxContainer}>
      {isChecked ? (
        <Icon name="checkbox-marked" size={30} color="#D6AD60" />
      ) : (
        <Icon name="checkbox-blank-outline" size={30} color="#D6AD60" />
      )}
    </TouchableOpacity>
  );
};

const Leads = () => {
  const navigation = useNavigation();

  const agents = [
    {
      id: "1",
      name: "Deepak kalaal",
      phone: "9736792612",
      email: "john@example.com",
      status: "Hot",
    },
    // Add more agents if needed
  ];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Talib Uddin", value: "option1" },
    { label: "Mohd Ahmad", value: "option2" },
    
  ]);

  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxPress = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({ item }) => {
    const isChecked = checkedItems[item.id] || false;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.agentName}>{item.name}</Text>
            <View style={styles.contactDetails}>
              <View style={styles.cardRow}>
                <Icon
                  name="phone"
                  size={20}
                  color="#D6AD60"
                  style={styles.icon}
                />
                <Text style={styles.contactText}>{item.phone}</Text>
              </View>
              <View style={styles.cardRow}>
                <Icon
                  name="email"
                  size={20}
                  color="#D6AD60"
                  style={styles.icon}
                />
                <Text style={styles.contactText}>{item.email}</Text>
              </View>
            </View>
          </View>
          <CustomCheckBox
            isChecked={isChecked}
            onPress={() => handleCheckboxPress(item.id)}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={25} color="#D6AD60" />
        </TouchableOpacity>
        <Text style={styles.heading}>All Leads :</Text>
      </View>
      <View style={styles.dropdownArea}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Agent Names"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.text}
          ArrowDownIconComponent={({ style }) => (
            <Icon name="chevron-down" size={25} color="#FFFFFF" />
          )}
          ArrowUpIconComponent={({ style }) => (
            <Icon name="chevron-up" size={25} color="#FFFFFF" />
          )}
        />
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() => console.log("Assigned")}
        >
          <Text style={styles.assignButtonText}>Assign</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator}></View>
      <FlatList
        data={agents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#122620",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 15,
    gap:15
  },
  heading: {
    fontSize: 20,
    color: "#D6AD60",
    flex: 1,
  },
  dropdownArea: {
    marginTop: 10,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1000,
  },
  dropdown: {
    width: 200,
    borderWidth: 1,
    backgroundColor: "transparent",
    borderColor: "rgba(244, 235, 208, 0.4)",
    borderRadius: 10,
    color: "#FFFFFF",
  },
  dropdownContainer: {
    width: 200,
    borderRadius: 5,
    backgroundColor: "#1A1A1A",
    borderColor: "rgba(244, 235, 208, 0.2)",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  assignButton: {
    backgroundColor: "#D6AD60",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  assignButtonText: {
    color: "#F4EBD0",
    fontSize: 18,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(244, 235, 208, 0.2)",
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal:15,
    backgroundColor: "rgba(128, 128, 128,0.5)",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(244, 235, 208, 0.3)",
  },
  cardContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: "#D6AD60",
    marginBottom: 5,
  },
  agentName: {
    fontSize: 18,
    color: "#F4EBD0",
    fontWeight: "bold",
  },
  contactDetails: {
    marginTop: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  contactText: {
    fontSize: 14,
    color: "#F4EBD0",
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  checkBoxContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});

export default Leads;
