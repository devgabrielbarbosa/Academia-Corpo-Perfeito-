// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore,  collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4r4Cmc29PCO2_iE9QK08XrhEr0s0l5P0",
  authDomain: "academia-corpo-perfeito.firebaseapp.com",
  projectId: "academia-corpo-perfeito",
  storageBucket: "academia-corpo-perfeito.appspot.com",
  messagingSenderId: "911045092513",
  appId: "1:911045092513:web:a90011c73f7a9c07287ce0",
  measurementId: "G-FB9DY6GNE1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);


// Função para importar equipamentos
async function importarEquipamentos() {
  const equipamentosRef = collection(db, "equipamentos");

  const equipamentos = [
    { nome: "Supino reto", status: "operacional" },
    { nome: "Supino inclinado", status: "operacional" },
    { nome: "Leg press", status: "operacional" },
    { nome: "Cadeira extensora", status: "operacional" },
    { nome: "Cadeira flexora", status: "operacional" },
    { nome: "Puxador costas", status: "operacional" },
    { nome: "Remada baixa", status: "operacional" },
    { nome: "Bicicleta ergométrica", status: "operacional" },
    { nome: "Esteira", status: "operacional" },
    { nome: "Elíptico", status: "operacional" },
    { nome: "Banco Scott", status: "operacional" },
    { nome: "Rosca direta", status: "operacional" },
    { nome: "Tríceps pulley", status: "operacional" },
    { nome: "Abdominal supra", status: "operacional" },
    { nome: "Abdominal infra", status: "operacional" },
    { nome: "Máquina de glúteos", status: "operacional" },
    { nome: "Cross-over", status: "operacional" },
    { nome: "Smith machine", status: "operacional" },
    { nome: "Banco de abdominal", status: "operacional" },
    { nome: "Barras olímpicas", status: "operacional" }
  ];

  try {
    for (const equipamento of equipamentos) {
      await addDoc(equipamentosRef, equipamento);
    }
    alert("Equipamentos importados com sucesso!");
  } catch (error) {
    console.error("Erro ao importar equipamentos:", error);
    alert("Erro ao importar equipamentos. Veja o console para detalhes.");
  }
}

// Exporta o db e a função para usar em outros módulos
export { db, importarEquipamentos };

// Torna a função disponível globalmente para usar no HTML
window.importarEquipamentos = importarEquipamentos;
