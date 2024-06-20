import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../../../services/firebaseConfig'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const ItemScreen = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'available',
    image_url: '',
  });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'product'));
    const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(itemsList);
  };

  const addItem = async () => {
    if (newItem.name.trim() && newItem.price.trim()) {
      const docRef = await addDoc(collection(db, 'product'), newItem);
      setItems([...items, { id: docRef.id, ...newItem }]);
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: '',
        status: 'available',
        image_url: '',
      });
    }
  };

  const editItem = (item) => {
    setEditingItem(item);
    setNewItem(item);
  };

  const updateItem = async () => {
    const itemDocRef = doc(db, 'product', editingItem.id);
    await updateDoc(itemDocRef, newItem);
    setItems(items.map(item => item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item));
    setEditingItem(null);
    setNewItem({
      name: '',
        description: '',
        price: '',
        category: '',
        status: 'available',
        image_url: '',
    });
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'product', id));
    setItems(items.filter(item => item.id !== id));
  };

  const toggleItemStatus = async (id) => {
    const item = items.find(item => item.id === id);
    const newStatus = item.status === 'available' ? 'unavailable' : 'available';
    await updateDoc(doc(db, 'product', id), { status: newStatus });
    setItems(items.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Product</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={newItem.name}
        onChangeText={(text) => setNewItem({ ...newItem, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={newItem.description}
        onChangeText={(text) => setNewItem({ ...newItem, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={newItem.price}
        onChangeText={(text) => setNewItem({ ...newItem, price: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={newItem.category}
        onChangeText={(text) => setNewItem({ ...newItem, category: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={newItem.image_url}
        onChangeText={(text) => setNewItem({ ...newItem, image_url: text })}
      />
      <Button
        title={editingItem ? "Update Item" : "Add Item"}
        onPress={editingItem ? updateItem : addItem}
      />
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemText}>ID: {item.id}</Text>
              <Text style={styles.itemText}>Name: {item.name}</Text>
              <Text style={styles.itemText}>Description: {item.description}</Text>
              <Text style={styles.itemText}>Price: {item.price}</Text>
              <Text style={styles.itemText}>Category: {item.category}</Text>
              <Text style={styles.itemText}>Status: {item.status}</Text>
              <Text style={styles.itemText}>Image URL: {item.image_url}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => toggleItemStatus(item.id)}>
                <Text style={styles.statusButton}>{item.status}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editItem(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  itemContainer: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 2,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
  itemActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default ItemScreen;
