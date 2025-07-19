import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

// Agora a função buscarEquipamentosPorStatus pode usar collection, query, where e getDocs
async function buscarEquipamentosPorStatus(statusBusca) {
  const equipamentosRef = collection(db, "equipamentos");
  const q = query(equipamentosRef, where("status", "==", statusBusca));
  const querySnapshot = await getDocs(q);

  const equipamentos = [];
  querySnapshot.forEach((doc) => {
    equipamentos.push(doc.data().nome);
  });
  return equipamentos;
}


// Controle do chatbot UI
const inputChat = document.getElementById("chat-input");
const btnEnviar = document.getElementById("chat-send");
const divMensagens = document.getElementById("chat-messages");
const btnToggle = document.getElementById("btn-toggle-chat");
const chatbot = document.getElementById("chatbot");

// Botão para abrir/fechar o chatbot
btnToggle.addEventListener("click", () => {
  if (chatbot.style.display === "flex") {
    chatbot.style.display = "none";
  } else {
    chatbot.style.display = "flex";
    inputChat.focus();
  }
});

// Função para adicionar mensagem na tela
function adicionarMensagem(texto, classe) {
  const divMsg = document.createElement("div");
  divMsg.className = `chat-msg ${classe}`;
  divMsg.textContent = texto;
  divMensagens.appendChild(divMsg);
  divMensagens.scrollTop = divMensagens.scrollHeight;
}

// Função principal que processa a pergunta do usuário e responde
async function processarPergunta(pergunta) {
  const p = pergunta.toLowerCase();

  // Perguntas que consultam Firestore
  if (p.includes("em manutenção") || p.includes("manutenção")) {
    const emManutencao = await buscarEquipamentosPorStatus("em manutenção");
    return emManutencao.length > 0
      ? `Os equipamentos em manutenção são: ${emManutencao.join(", ")}.`
      : "Nenhum equipamento está em manutenção no momento.";
  }

if (p.includes("quebrado") || p.includes("quebrados") || p.includes("quebrada")) {
  const quebrados = await buscarEquipamentosPorStatus("quebrado"); // Q maiúsculo aqui
  return quebrados.length > 0
    ? `Os equipamentos quebrados são: ${quebrados.join(", ")}.`
    : "Nenhum equipamento está quebrado.";
}


  if (p.includes("funcionando") || p.includes("operacional") || p.includes("ativos") || p.includes("funcionando")) {
    const operacionais = await buscarEquipamentosPorStatus("operacional");
    return operacionais.length > 0
      ? `Os equipamentos funcionando normalmente são: ${operacionais.join(", ")}.`
      : "Nenhum equipamento está funcionando no momento.";
  }

  // Respostas fixas (sem consultar Firebase)
  if (p.includes("horário") || p.includes("funciona")) {
    return "A academia funciona de segunda a sábado das 6h às 22h.";
  }

  if (p.includes("planos") || p.includes("mensalidade") || p.includes("preço")) {
    return "Temos 3 planos: Básico R$ 69,90, Plus R$ 99,90 e Premium R$ 129,90.";
  }

  if (p.includes("musculação")) {
    return "Sim! Temos musculação com equipamentos modernos e acompanhamento profissional.";
  }

  if (p.includes("zumba")) {
    return "Temos aulas de zumba nas segundas, quartas e sextas às 19h.";
  }

  if (p.includes("pilates")) {
    return "Temos aulas de pilates todas as manhãs às 8h.";
  }

  if (p.includes("nutricionista")) {
    return "Temos parceria com nutricionistas. Consulte a recepção para agendar.";
  }

  if (p.includes("avaliação física")) {
    return "Sim! Fazemos avaliação física gratuita todo mês para alunos ativos.";
  }

  if (p.includes("wifi")) {
    return "Sim! Temos Wi-Fi gratuito. Solicite a senha na recepção.";
  }

  if (p.includes("estacionamento")) {
    return "Sim! Temos estacionamento gratuito para alunos.";
  }

  if (p.includes("personal")) {
    return "Temos personal trainers disponíveis. Consulte horários e valores.";
  }

  if (p.includes("você é real") || p.includes("você é humano")) {
    return "Sou um assistente virtual da Academia Corpo Perfeito, feito com carinho. 💪🤖";
  }

  if (p.includes("tem vestiário")) {
    return "Sim! Temos vestiários masculinos e femininos com chuveiros.";
  }

  if (p.includes("forma de pagamento")) {
    return "Aceitamos cartão, pix, boleto e pagamento recorrente via app.";
  }

  if (p.includes("como chegar") || p.includes("localização")) {
    return "Estamos localizados na Ponta do Asfalto - Wanderlândia-TO.";
  }

  if (p.includes("tem banho")) {
    return "Sim, temos chuveiros disponíveis nos vestiários.";
  }

  if (p.includes("tem ar-condicionado")) {
    return "Sim! O ambiente da academia é climatizado para seu conforto.";
  }

  if (p.includes("tem água")) {
    return "Temos bebedouros de água gelada disponíveis.";
  }

  if (p.includes("tempo de treino")) {
    return "O tempo de treino é livre durante o expediente da academia.";
  }

  if (p.includes("aulas disponíveis")) {
    return "Oferecemos aulas de zumba, pilates, funcional, HIIT e spinning.";
  }

  if (p.includes("tem spinning")) {
    return "Sim! As aulas de spinning são terças e quintas às 18h.";
  }

  if (p.includes("tem hiit")) {
    return "Sim! HIIT de alta intensidade às segundas e quartas às 20h.";
  }

  if (p.includes("tem crossfit")) {
    return "No momento, não oferecemos crossfit.";
  }

  if (p.includes("tem dança")) {
    return "Sim! Aulas de dança com foco em queima calórica e diversão!";
  }

  if (p.includes("tem área de descanso")) {
    return "Sim! Temos uma área de convivência com sofás, revistas e café.";
  }

  if (p.includes("tem armário")) {
    return "Sim! Temos armários. Traga seu cadeado pessoal para uso seguro.";
  }

  if (p.includes("tem loja") || p.includes("vende suplementos")) {
    return "Temos uma pequena loja com suplementos, bebidas e acessórios.";
  }

  if (p.includes("chatbot") || p.includes("funciona o chat")) {
    return "Sou seu assistente virtual para tirar dúvidas rápidas sobre a academia. 😄";
  }

  // Resposta padrão para perguntas não reconhecidas
  return "Desculpe, não entendi sua pergunta. Tente reformular ou pergunte sobre horários, planos, aulas ou equipamentos.";
}

// Enviar mensagem ao clicar no botão ou pressionar Enter
async function enviarMensagem() {
  const texto = inputChat.value.trim();
  if (!texto) return;

  adicionarMensagem(texto, "user");
  inputChat.value = "";

  const resposta = await processarPergunta(texto);
  adicionarMensagem(resposta, "bot");
}

btnEnviar.addEventListener("click", enviarMensagem);
inputChat.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarMensagem();
  }
});
