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

// Función para formatear la fecha (¡NUEVO!)
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

  // Carga y ordena items por fecha
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

  // Añadir item con timestamp
  const addItem = async () => {
    if (newItem.trim() !== '') {
      await addDoc(collection(db, 'items'), {
        text: newItem,
        completed: false,
        timestamp: new Date() // Guarda fecha actual
      });
      setNewItem('');
    }
  };

  // Eliminar item
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  // Marcar como completado
  const toggleComplete = async (id, currentStatus) => {
    await updateDoc(doc(db, 'items', id), {
      completed: !currentStatus
    });
  };

  return (
    <div className="App">
      <h1>Lista de Compras 🛒</h1>
      
      <input 
        type="text" 
        value={newItem} 
        onChange={(e) => setNewItem(e.target.value)} 
        placeholder="Leche, pan..."
      />
      <button onClick={addItem}>Añadir</button>

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
              <small style={{ color: "gray", marginLeft: "10px" }}>
                {formatDate(item.timestamp)} {/* Fecha formateada aquí */}
              </small>
            </div>
            <div>
              <button 
                onClick={() => toggleComplete(item.id, item.completed)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  marginRight: '8px'
                }}
              >
                {item.completed ? "✅" : "⬜"}
              </button>
              <button 
                onClick={() => deleteItem(item.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'red' 
                }}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;