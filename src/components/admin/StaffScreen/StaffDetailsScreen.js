import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import { format } from 'date-fns';

const StaffDetailsScreen = ({ route, navigation }) => {
  const { staffId } = route.params;
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      const staffDoc = await getDoc(doc(db, 'staff', staffId));
      if (staffDoc.exists()) {
        setStaff(staffDoc.data());
      } else {
        Alert.alert('Error', 'Staff not found');
        navigation.goBack();
      }
    };

    fetchStaff();
  }, [staffId]);

  const handleDelete = async () => {
    Alert.alert(
      "Delete Staff",
      "Are you sure you want to delete this staff member?",
      [
        { text: "Cancel" },
        { text: "Delete", onPress: async () => {
            await deleteDoc(doc(db, 'staff', staffId));
            Alert.alert('Success', 'Staff deleted successfully');
            navigation.navigate('StaffScreen', { refresh: true }); // Navigate back to StaffScreen with a refresh flag
          }
        }
      ]
    );
  };

  if (!staff) return null;

  const formattedJoinDate = format(new Date(staff.joinDate), 'dd-MMMM-yyyy EEEE');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Details</Text>
      <Text style={styles.detailText}>Full Name: {staff.name}</Text>
      <Text style={styles.detailText}>Phone Number: {staff.phoneNumber}</Text>
      <Text style={styles.detailText}>Join Date: {formattedJoinDate}</Text>
      <Text style={styles.detailText}>Status: {staff.status ? 'Active' : 'Inactive'}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Staff</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  deleteButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#d32f2f',
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StaffDetailsScreen;
