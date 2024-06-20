import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../../../services/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

// Defining StaffScreen component and destructuring navigation prop
const StaffScreen = ({ navigation }) => {
  // Initializing staff state as an empty array to hold staff data
  const [staff, setStaff] = useState([]);

  const fetchStaff = async () => {
    // Getting reference to the 'staff' collection in Firestore
    const staffCollection = collection(db, 'staff');
    // Fetching all documents from the 'staff' collection
    const staffSnapshot = await getDocs(staffCollection);
    // Mapping through fetched documents and creating a list with id and data
    const staffList = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStaff(staffList);
  };

  // useFocusEffect hook to run fetchStaff function when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchStaff();
    }, [])
  );

  // Function to toggle the status of a staff member
  const toggleStatus = async (id, status) => {
    // Getting reference to the specific staff document
    const staffDoc = doc(db, 'staff', id);
    // Updating the status field in the document to the opposite of the current status
    await updateDoc(staffDoc, { status: !status });
    // Updating the staff state with the new status
    setStaff(staff.map(staff => (staff.id === id ? { ...staff, status: !status } : staff)));
  };

  // Function to handle the delete staff
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Staff",
      "Are you sure you want to delete this staff member?",
      [
        { text: "Cancel" },
        { text: "Delete", onPress: async () => {
            await deleteDoc(doc(db, 'staff', id));
            Alert.alert('Success', 'Staff deleted successfully');
            fetchStaff(); // Refresh the staff list after deletion
          }
        }
      ]
    );
  };

  // Function to render each item in the staff list
  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => navigation.navigate('StaffDetails', { staffId: item.id })}>
      <View style={styles.staffRow}>
        <Text style={styles.staffText}>{index + 1}</Text>
        <Text style={styles.staffText}>{item.name}</Text>
        <Switch
          value={item.status}
          onValueChange={() => toggleStatus(item.id, item.status)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="users" size={30} color="#000" />
        <Text style={styles.title}>Staff Details</Text>
      </View>
      {staff.length > 0 ? (
        <>
          <View style={styles.staffHeader}>
            <Text style={styles.headerText}>No</Text>
            <Text style={styles.headerText}>Name</Text>
            <Text style={styles.headerText}>Status</Text>
          </View>
          <FlatList
            data={staff}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </>
      ) : (
        <Text style={styles.noStaffText}>No staff members available.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddStaff')}>
        <Text style={styles.buttonText}>Create Staff</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  staffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
  },
  staffText: {
    fontSize: 16,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noStaffText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StaffScreen;
s