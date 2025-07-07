// Importa las funciones necesarias (línea 1)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // ¡Añade esta línea!

// Configuración de Firebase (usa tus credenciales actuales) (línea 5)
const firebaseConfig = {
  apiKey: "AIzaSyD3jKBo0aLLLfM4RUDLGGNJPF9Ur7mcESw",
  authDomain: "lista-compras-5adc1.firebaseapp.com",
  projectId: "lista-compras-5adc1",
  storageBucket: "lista-compras-5adc1.firebasestorage.app",
  messagingSenderId: "671463113815",
  appId: "1:671463113815:web:b26c89d683bc2764628f12",
  measurementId: "G-D1QESYRJ6V"
};

// Inicializa Firebase (línea 16)
const app = initializeApp(firebaseConfig);

// Inicializa Firestore (¡esto es lo que necesitas!) (línea 19)
const db = getFirestore(app);

// Exporta db para usarlo en otros archivos (línea 22)
export { db };  // ¡Esto solucionará el error!