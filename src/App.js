import { useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import './App.css';

const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return "Sin fecha";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
};

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState(''); // <-- Le agregué validación de error

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      setItems(itemsData);
    });
    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    if (newItem.trim() === '') {
      setError('⚠️ Por favor ingresa un producto');
      setTimeout(() => setError(''), 3000); // Elimina el error después de 3 segundos
      return;
    }

    await addDoc(collection(db, 'items'), {
      text: newItem,
      completed: false,
      timestamp: new Date() // <-- Agregué timestamp para ordenar por fecha
    });

    setNewItem('');
    setError('');
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  const toggleComplete = async (id, currentStatus) => {
    await updateDoc(doc(db, 'items', id), {
      completed: !currentStatus // Cambia el estado de completado a lo contrario
    });
  };

  return (
    <div className="App">
      <h1>Lista de Compras 🛒</h1>

      <form className="input-group" onSubmit={(e) => {
        e.preventDefault(); // Evita recarga
        addItem();
      }}>
        <input 
          type="text" 
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)} //
          placeholder="Leche, pan..."
          className={error ? 'error' : ''}
        />
        <button type="submit">Añadir</button>
      </form>


      {error && <p className="error-message">{error}</p>}

      <ul>
        {items.map((item) => (
          <li 
            key={item.id} 
            style={{ 
              textDecoration: item.completed ? "line-through" : "none",
              opacity: item.completed ? 0.7 : 1
            }}
          >
            <div>
              <span>{item.text}</span>
              <small>{formatDate(item.timestamp)}</small>
            </div>
            <div>
              <button 
                onClick={() => toggleComplete(item.id, item.completed)}
              >
                {item.completed ? "✅ Completado " : "⬜ Completar"}
              </button>
              <button 
                onClick={() => deleteItem(item.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
