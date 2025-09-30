import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

// 🔎 Buscar equipamentos no Firestore por status
async function buscarEquipamentosPorStatus(statusBusca) {
  try {
    const equipamentosRef = collection(db, "equipamentos");
    const q = query(equipamentosRef, where("status", "==", statusBusca));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().nome);
  } catch (err) {
    console.error("Erro ao buscar equipamentos:", err);
    return [];
  }
}

// ---------------- CHATBOT ----------------
const inputChat = document.getElementById("chat-input");
const btnEnviar = document.getElementById("chat-send");
const divMensagens = document.getElementById("chat-messages");
const btnToggle = document.getElementById("btn-toggle-chat");
const chatbot = document.getElementById("chatbot");

// Abrir/fechar chat
btnToggle.addEventListener("click", () => {
  chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
  if (chatbot.style.display === "flex") {
    inputChat.focus();
    if (divMensagens.children.length === 0) {
      exibirMensagem(
        "Olá! Eu sou o MaxFit, seu assistente virtual da Academia Corpo Perfeito. 💪 Em que posso te ajudar?",
        "bot"
      );
    }
  }
});

// ---------------- RESPOSTAS FIXAS ----------------
const respostas = [
  { chaves: ["horário", "hora", "funciona", "abre", "fechado"], resposta: ["A academia funciona de segunda a sexta das 6h às 22h e aos sábados das 8h às 16h.", "Nosso horário é: seg a sex das 6h às 22h e sábado das 8h às 16h."] },
  { chaves: ["planos", "preço", "mensalidade", "valor"], resposta: "Temos 3 planos: Básico R$ 69,90, Plus R$ 99,90 e Premium R$ 129,90." },
  { chaves: ["musculação", "peso", "treino de força"], resposta: "Sim! Temos musculação moderna e acompanhada por profissionais." },
  { chaves: ["zumba"], resposta: "Zumba nas segundas, quartas e sextas às 19h." },
  { chaves: ["pilates"], resposta: "Pilates todas as manhãs às 8h." },
  { chaves: ["nutricionista"], resposta: "Temos parceria com nutricionistas. Consulte a recepção." },
  { chaves: ["wifi", "internet"], resposta: "Sim! Temos Wi-Fi gratuito. Solicite a senha na recepção." },
  { chaves: ["obrigado", "valeu", "agradecido"], resposta: ["Por nada! Estamos à disposição. 😄", "Disponha, sempre por aqui!", "Imagina, estamos juntos! 💪"] },
  { chaves: ["seu nome", "quem é você"], resposta: "Me chamo CorpoBot, seu assistente da Academia Corpo Perfeito! 💪" }
];

// 🎲 Escolher resposta aleatória
function escolherResposta(resposta) {
  if (Array.isArray(resposta)) return resposta[Math.floor(Math.random() * resposta.length)];
  return resposta;
}

// Procurar resposta fixa
function procurarResposta(pergunta) {
  const p = pergunta.toLowerCase();
  for (let item of respostas) {
    if (item.chaves.some(chave => p.includes(chave))) {
      return escolherResposta(item.resposta);
    }
  }
  return null;
}

// ---------------- PROCESSAMENTO ----------------
async function processarPergunta(pergunta) {
  const p = pergunta.toLowerCase();

  // 🔹 Consultar Firestore dinamicamente
  if (p.includes("manutenção")) {
    const emManutencao = await buscarEquipamentosPorStatus("em manutenção");
    return emManutencao.length 
      ? `Equipamentos em manutenção:\n${emManutencao.map((eq, i) => `${i + 1}. ${eq}`).join("\n")}` 
      : "Nenhum equipamento em manutenção.";
  }

  if (p.includes("quebrado") || p.includes("quebrados") || p.includes("quebrada")) {
    const quebrados = await buscarEquipamentosPorStatus("quebrado");
    return quebrados.length 
      ? `Os equipamentos quebrados são:\n${quebrados.map((eq, i) => `${i + 1}. ${eq}`).join("\n")}` 
      : "Nenhum equipamento está quebrado.";
  }

  if (p.includes("funcionando") || p.includes("operacional") || p.includes("ativos") || p.includes("disponíveis")) {
    const operacionais = await buscarEquipamentosPorStatus("operacional");
    return operacionais.length 
      ? `Equipamentos funcionando:\n${operacionais.map((eq, i) => `${i + 1}. ${eq}`).join("\n")}` 
      : "Nenhum equipamento em operação.";
  }

  // 🔹 Resposta fixa
  const respostaFixa = procurarResposta(pergunta);
  if (respostaFixa) return respostaFixa;

  return "Desculpe, não entendi. Pode reformular a pergunta?";
}

// ---------------- ENVIO ----------------
async function enviarMensagem() {
  const texto = inputChat.value.trim();
  if (!texto) return;

  exibirMensagem(texto, "user");
  inputChat.value = "";

  // "Digitando..."
  const msgDigitando = document.createElement("div");
  msgDigitando.className = "chat-msg bot";
  msgDigitando.textContent = "Digitando...";
  divMensagens.appendChild(msgDigitando);
  divMensagens.scrollTop = divMensagens.scrollHeight;

  const resposta = await processarPergunta(texto);

  setTimeout(() => {
    msgDigitando.remove();
    exibirMensagem(resposta, "bot");
  }, 1200);
}

// ✅ Exibir mensagens
function exibirMensagem(texto, remetente) {
  const divMsg = document.createElement("div");
  divMsg.className = `chat-msg ${remetente}`;
  divMsg.innerHTML = texto.replace(/\n/g, "<br>");
  divMensagens.appendChild(divMsg);
  divMensagens.scrollTop = divMensagens.scrollHeight;
}

// Eventos
btnEnviar.addEventListener("click", enviarMensagem);
inputChat.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarMensagem();
  }
});
