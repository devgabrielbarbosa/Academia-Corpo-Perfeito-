import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

// 🔎 Buscar equipamentos no Firestore por status
async function buscarEquipamentosPorStatus(statusBusca) {
  const equipamentosRef = collection(db, "equipamentos");
  const q = query(equipamentosRef, where("status", "==", statusBusca));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data().nome);
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
      exibirMensagem("Olá! Eu sou o MaxFit, seu assistente virtual da Academia Corpo Perfeito. 💪 Em que posso te ajudar?", "bot");
    }
  }
});

// ✅ Exibir mensagens (suporta quebras de linha)
function exibirMensagem(texto, remetente) {
  const div = document.createElement("div");
  div.className = `chat-msg ${remetente}`;
  div.innerHTML = texto.replace(/\n/g, "<br>");
  divMensagens.appendChild(div);
  divMensagens.scrollTop = divMensagens.scrollHeight;
}

// ---------------- RESPOSTAS ----------------

// 🔥 Mais de 50 respostas fixas com sinônimos
const respostas = [
  { chaves: ["horário", "hora", "funciona", "abre", "fechado"], resposta: [
      "A academia funciona de segunda a sexta das 6h às 22h e aos sábados das 8h às 16h.",
      "Nosso horário é: seg a sex das 6h às 22h e sábado das 8h às 16h."
    ] 
  },
  { chaves: ["planos", "preço", "mensalidade", "valor"], resposta: "Temos 3 planos: Básico R$ 69,90, Plus R$ 99,90 e Premium R$ 129,90." },
  { chaves: ["musculação", "peso", "treino de força"], resposta: "Sim! Temos musculação moderna e acompanhada por profissionais." },
  { chaves: ["zumba"], resposta: "Zumba nas segundas, quartas e sextas às 19h." },
  { chaves: ["pilates"], resposta: "Pilates todas as manhãs às 8h." },
  { chaves: ["nutricionista"], resposta: "Temos parceria com nutricionistas. Consulte a recepção." },
  { chaves: ["avaliação física", "avaliar"], resposta: "Fazemos avaliação física gratuita todo mês para alunos ativos." },
  { chaves: ["wifi", "internet"], resposta: "Sim! Temos Wi-Fi gratuito. Solicite a senha na recepção." },
  { chaves: ["estacionamento", "carro"], resposta: "Estacionamento gratuito para alunos." },
  { chaves: ["personal", "treinador"], resposta: "Temos personal trainers. Consulte horários e valores." },
  { chaves: ["vestiário", "banho"], resposta: "Sim! Temos vestiários com chuveiros." },
  { chaves: ["pagamento", "pix", "boleto", "cartão"], resposta: "Aceitamos cartão, pix, boleto e pagamento recorrente via app." },
  { chaves: ["localização", "endereço", "onde fica"], resposta: "Estamos localizados na Ponta do Asfalto - Wanderlândia-TO." },
  { chaves: ["ar-condicionado", "climatizado"], resposta: "Sim! A academia é climatizada para seu conforto." },
  { chaves: ["água", "bebedouro"], resposta: "Temos bebedouros de água gelada." },
  { chaves: ["tempo de treino", "quanto tempo"], resposta: "O tempo de treino é livre durante o expediente." },
  { chaves: ["aulas disponíveis", "atividades"], resposta: "Oferecemos zumba, pilates, funcional, HIIT e spinning." },
  { chaves: ["spinning"], resposta: "Spinning terças e quintas às 18h." },
  { chaves: ["hiit"], resposta: "HIIT segundas e quartas às 20h." },
  { chaves: ["crossfit"], resposta: "No momento, não oferecemos crossfit." },
  { chaves: ["dança"], resposta: "Sim! Aulas de dança focadas em diversão e queima calórica." },
  { chaves: ["descanso", "sofá"], resposta: "Temos área de convivência com sofás, revistas e café." },
  { chaves: ["armário", "locker"], resposta: "Sim! Traga seu cadeado para usar os armários." },
  { chaves: ["loja", "suplemento"], resposta: "Temos loja com suplementos e acessórios." },
  { chaves: ["chatbot", "como funciona o chat"], resposta: "Sou seu assistente virtual para dúvidas rápidas. 😄" },
  { chaves: ["obrigado", "valeu", "agradecido"], resposta: [
      "Por nada! Estamos à disposição. 😄", 
      "Disponha, sempre por aqui!", 
      "Imagina, estamos juntos! 💪"
    ] 
  },
  { chaves: ["seu nome", "quem é você"], resposta: "Me chamo CorpoBot, seu assistente da Academia Corpo Perfeito! 💪" },
  { chaves: ["quem criou", "quem te fez"], resposta: "Fui criado pela equipe de tecnologia da academia." },
  { chaves: ["sua função", "o que você faz"], resposta: "Respondo dúvidas sobre a academia, planos, aulas e equipamentos." },
  { chaves: ["aula experimental", "aula grátis"], resposta: "Sim! Temos aula experimental gratuita. Agende na recepção." },
  { chaves: ["idade mínima", "criança"], resposta: "A idade mínima é 14 anos, com autorização dos responsáveis." },
  { chaves: ["aplicativo", "app"], resposta: "Nosso app permite ver treinos, pagar mensalidade e acompanhar evolução." },
  { chaves: ["treinar em outro horário"], resposta: "Pode sim! O plano Premium oferece acesso livre." },
  { chaves: ["avaliação inicial", "primeira avaliação"], resposta: "A avaliação inicial é gratuita com nossos profissionais." },
  { chaves: ["funcional"], resposta: "Funcional às terças e quintas às 19h." },
  { chaves: ["plano família", "desconto família"], resposta: "Temos plano família com desconto progressivo." },
  { chaves: ["day use", "pagar por dia"], resposta: "Day use custa R$ 20 para 1 dia completo." },
  { chaves: ["feriado"], resposta: "Nos feriados temos horário especial, consulte no Instagram." },
  { chaves: ["melhor hora", "horário vazio"], resposta: "Horários mais tranquilos: 10h às 14h e após 20h." },
  { chaves: ["sábado"], resposta: "Sim! Aos sábados temos treinos livres e aulas especiais." },
  { chaves: ["como funciona o treino"], resposta: "Você pode treinar sozinho ou com ficha personalizada." },
  { chaves: ["massagem", "relaxamento"], resposta: "Temos massoterapia em parceria, agende na recepção." },
  { chaves: ["fisioterapia"], resposta: "Temos fisioterapia para recuperação e prevenção de lesões." },
  { chaves: ["fotos", "quero ver fotos"], resposta: "Veja fotos no nosso Instagram: @corpoperfeito_academia 📸" },
  { chaves: ["instagram", "redes sociais"], resposta: "Nos siga no Instagram @corpoperfeito_academia." },
  { chaves: ["lanche", "café da manhã"], resposta: "Vendemos lanches saudáveis na loja da academia." },
  { chaves: ["espelho"], resposta: "Temos espelhos grandes na sala de musculação." },
  { chaves: ["cancelar plano", "cancelamento"], resposta: "O cancelamento pode ser feito presencialmente ou pelo app." },
  { chaves: ["segurança", "câmera"], resposta: "Sim! Temos câmeras e controle de acesso para sua segurança." },
  { chaves: ["certificado"], resposta: "Emitimos certificado em workshops e eventos." },
  { chaves: ["competição", "campeonato"], resposta: "Fazemos desafios internos e campeonatos de tempos em tempos." },
  { chaves: ["nutricional", "nutri"], resposta: "Temos convênio com nutricionistas especializados em performance." }
];

// 🎲 Escolher resposta (aleatória se for array)
function escolherResposta(resposta) {
  if (Array.isArray(resposta)) {
    const i = Math.floor(Math.random() * resposta.length);
    return resposta[i];
  }
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

  // Firestore dinâmico numerado
  if (p.includes("manutenção")) {
    const emManutencao = await buscarEquipamentosPorStatus("em manutenção");
    return emManutencao.length 
      ? `Equipamentos em manutenção:\n${emManutencao.map((eq, i) => `${i + 1}. ${eq}`).join("\n")}`
      : "Nenhum equipamento em manutenção.";
  }

if (p.includes("quebrado") || p.includes("quebrados") || p.includes("quebrada")) {
  const quebrados = await buscarEquipamentosPorStatus("quebrado"); // Q maiúsculo aqui
  return quebrados.length > 0
    ? `Os equipamentos quebrados são: ${quebrados.join(", ")}.`
    : "Nenhum equipamento está quebrado.";
}


 if (p.includes("funcionando") || p.includes("operacional") || p.includes("ativos")) {
  const operacionais = await buscarEquipamentosPorStatus("operacional");
  return operacionais.length > 0
    ? `Os equipamentos funcionando normalmente são:${operacionais.join(",")}.`
    : "Nenhum equipamento está funcionando no momento.";
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

btnEnviar.addEventListener("click", enviarMensagem);
inputChat.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarMensagem();
  }
});
}