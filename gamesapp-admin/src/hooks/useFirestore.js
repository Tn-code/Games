import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, Timestamp, updateDoc, onSnapshot } from 'firebase/firestore';

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [collectionName]);

  const addItem = async (item) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: Timestamp.now()
      });
      await fetchData();
      return { success: true, id: docRef.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: Timestamp.now()
      });
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, fetchData, addItem, updateItem, deleteItem };
}
