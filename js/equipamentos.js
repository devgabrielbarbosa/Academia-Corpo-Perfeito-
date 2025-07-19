/*import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { db } from "./firebase-config.js"; // ajuste o caminho se necessário

const equipamentos = [
  { nome: "Supino reto", status: "operacional" },
  { nome: "Supino inclinado", status: "operacional" },
  { nome: "Supino declinado", status: "em manutenção" },
  { nome: "Leg press", status: "operacional" },
  { nome: "Agachamento livre (barra)", status: "operacional" },
  { nome: "Extensor de pernas", status: "operacional" },
  { nome: "Flexor de pernas", status: "quebrado" },
  { nome: "Puxador frontal", status: "operacional" },
  { nome: "Remada baixa", status: "em manutenção" },
  { nome: "Rosca direta (barra)", status: "operacional" },
  { nome: "Rosca scott", status: "operacional" },
  { nome: "Tríceps pulley", status: "operacional" },
  { nome: "Elevação lateral de ombros", status: "operacional" },
  { nome: "Desenvolvimento de ombros (máquina)", status: "quebrado" },
  { nome: "Peck deck (voador)", status: "operacional" },
  { nome: "Abdominal infra", status: "operacional" },
  { nome: "Abdominal supra", status: "quebrado" },
  { nome: "Crossover (polia cruzada)", status: "operacional" },
  { nome: "Esteira", status: "em manutenção" },
  { nome: "Bicicleta ergométrica", status: "operacional" },
  { nome: "Bicicleta spinning", status: "operacional" },
  { nome: "Elíptico", status: "em manutenção" },
  { nome: "Escada stepper", status: "operacional" },
  { nome: "Remo indoor (máquina de remo)", status: "operacional" },
  { nome: "Transport (bicicleta reclinada)", status: "operacional" },
  { nome: "Kettlebell", status: "operacional" },
  { nome: "Bola suíça", status: "operacional" },
  { nome: "TRX (sistema de suspensão)", status: "operacional" },
  { nome: "Caixa pliométrica", status: "operacional" },
  { nome: "Colchonete para exercícios", status: "operacional" },
  { nome: "Halteres (diversos pesos)", status: "quebrado" },
  { nome: "Anilhas (diversos pesos)", status: "operacional" },
  { nome: "Barra olímpica", status: "operacional" },
  { nome: "Rolo de espuma (foam roller)", status: "operacional" },
  { nome: "Corda naval (battle rope)", status: "operacional" },
  { nome: "Saco de pancadas", status: "operacional" },
  { nome: "Banco de supino ajustável", status: "operacional" },
  { nome: "Banco para exercícios abdominais", status: "em manutenção" },
  { nome: "Plataforma vibratória", status: "operacional" },
  { nome: "Step para aeróbica", status: "operacional" },
  { nome: "Racks para barra e anilhas", status: "operacional" },
  { nome: "Escada de agilidade", status: "operacional" },
  { nome: "Espaldar", status: "operacional" },
  { nome: "Estação de treinamento multifuncional", status: "quebrado" }
];


async function importarEquipamentos() {
  const equipamentosRef = collection(db, "equipamentos");

  for (const equipamento of equipamentos) {
    try {
      await addDoc(equipamentosRef, equipamento);
      console.log(`Equipamento ${equipamento.nome} adicionado com sucesso!`);
    } catch (error) {
      console.error(`Erro ao adicionar ${equipamento.nome}:`, error);
    }
  }
  console.log("Importação finalizada!");
}

// Chame essa função uma vez no seu código para importar
importarEquipamentos();
*/