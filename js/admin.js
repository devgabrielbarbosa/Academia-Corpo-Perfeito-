import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const equipamentosRef = collection(db, "equipamentos");
const listaEquipamentos = document.getElementById("listaEquipamentos");

// Iniciar escuta em tempo real para equipamentos
function iniciarEquipamentos() {
  const q = query(equipamentosRef);
  onSnapshot(q, (snapshot) => {
    if (!listaEquipamentos) return;
    listaEquipamentos.innerHTML = "";

    snapshot.forEach(docSnap => {
      const dados = docSnap.data();

      const tr = document.createElement("tr");
      tr.dataset.id = docSnap.id;
      tr.innerHTML = `
        <td>${dados.nome || "-"}</td>
        <td>${dados.status || "-"}</td>
        <td>
          <button onclick="editarEquipamento('${docSnap.id}')">Editar</button>
        </td>
        <td>
          <button onclick="removerEquipamento('${docSnap.id}')">Remover</button>
        </td>
      `;
      listaEquipamentos.appendChild(tr);
    });
  });
}

async function cadastrarEquipamento() {
  const nome = document.getElementById('nomeEquipamento').value.trim();
  const status = document.getElementById('statusEquipamento').value;

  if (!nome) {
    alert("Preencha o nome do equipamento!");
    return;
  }

  try {
    await addDoc(equipamentosRef, {
      nome,
      status,
      criadoEm: serverTimestamp()
    });

    document.getElementById('nomeEquipamento').value = '';
    document.getElementById('statusEquipamento').value = 'Operacional';

  } catch (err) {
    console.error("Erro ao cadastrar equipamento:", err);
    alert("Erro ao cadastrar equipamento.");
  }
}

async function removerEquipamento(id) {
  if (!confirm("Tem certeza que deseja remover este equipamento?")) return;
  try {
    await deleteDoc(doc(db, "equipamentos", id));
  } catch (err) {
    console.error("Erro ao remover equipamento:", err);
    alert("Erro ao remover equipamento.");
  }
}

async function editarEquipamento(id) {
  try {
    const docRef = doc(db, "equipamentos", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Equipamento não encontrado!");
      return;
    }

    const dados = docSnap.data();

    const novoNome = prompt("Editar nome:", dados.nome);
    if (!novoNome) return;

    const novoStatus = prompt("Editar status (Operacional, Em Manutenção, Quebrado):", dados.status);
    if (!novoStatus) return;

    await updateDoc(docRef, {
      nome: novoNome.trim(),
      status: novoStatus.trim()
    });

  } catch (err) {
    console.error("Erro ao editar equipamento:", err);
    alert("Erro ao editar equipamento.");
  }
}

// --- MATRÍCULAS E PLANOS ---

const planosRef = collection(db, "planos");
const matriculasRef = collection(db, "matriculas");
const listaMatriculas = document.getElementById("lista-alunos");
const planosCache = new Map();
async function carregarPlanos() {
  try {
    const snapshot = await getDocs(planosRef);
    planosCache.clear();
    snapshot.forEach(doc => {
      planosCache.set(doc.id, doc.data());
    });
    preencherSelectPlanos();
  } catch (err) {
    console.error("Erro ao carregar planos:", err);
  }
}

function preencherSelectPlanos() {
  const select = document.getElementById("planoAluno");
  if (!select) return;

  select.innerHTML = '<option value="">Selecione um plano</option>';
  planosCache.forEach((plano, id) => {
    const opt = document.createElement("option");
    opt.value = id;           // importante: o value é o ID do plano
    opt.textContent = plano.nome; // mostra o nome no texto
    select.appendChild(opt);
  });
}

function iniciarMatriculas() {
  const qMatriculas = query(matriculasRef);

  onSnapshot(qMatriculas, (snapshot) => {
    if (!listaMatriculas) return;
    listaMatriculas.innerHTML = "";

    snapshot.forEach(docSnap => {
      const dados = docSnap.data();

      const planoId = dados.planoId; // CORRETO
      const planoObj = planosCache.get(planoId);
      const nomePlano = dados.planoNome || "Plano não encontrado";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <tr>
  <td>${dados.nome || "-"}</td>
  <td>${nomePlano}</td>
  <td>${dados.email || "-"}</td>
  <td>${dados.telefone || "-"}</td>
  <td>${dados.cpf || "-"}</td> <!-- este é o campo do CPF -->
  <td><button onclick="removerMatricula('${docSnap.id}')">Remover</button></td>
</tr>
      `;
      listaMatriculas.appendChild(tr);
    });
  });
}


(async () => {
  await carregarPlanos(); // espera os planos carregarem
  iniciarMatriculas();    // só depois inicia as matrículas
  iniciarEquipamentos();  // e o resto do sistema
})();

async function cadastrarAluno() {
  const n = document.getElementById("nomeAluno").value.trim();
  const p = document.getElementById("planoAluno").value; // aqui é o ID do plano
  const e = document.getElementById("emailAluno").value.trim();
  const t = document.getElementById("telefoneAluno").value.trim();

  if (!n || !p) {
    return alert("Preencha o nome e selecione um plano.");
  }

  try {
    console.log("ID do plano selecionado:", p); // para testar

    await addDoc(matriculasRef, {
      nome: n,
      plano: p, // grava o ID do plano
      email: e,
      telefone: t,
      cpf: c,
      dataCadastro: serverTimestamp()
    });

    ["nomeAluno", "planoAluno", "emailAluno", "telefoneAluno"]
      .forEach(id => document.getElementById(id).value = "");

  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    alert("Erro ao cadastrar aluno.");
  }
}

async function removerMatricula(id) {
  try {
    await deleteDoc(doc(db, "matriculas", id));
  } catch (err) {
    console.error(err);
    alert("Erro ao remover matrícula.");
  }
}

// --- LOGIN ---

function fazerLogin() {
  const u = document.getElementById("usuario").value;
  const s = document.getElementById("senha").value;

  if (u === "admin" && s === "1234") {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("sistemaContainer").style.display = "block";
    mostrarSecao("agendamentos");
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

// --- ABAS ---

function mostrarSecao(sec) {
  ["agendamentos", "equipamentos", "alunos"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === sec ? "block" : "none");
  });

  document.querySelectorAll("nav.tabs button").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes(sec));
  });
}

// --- Inicialização geral ---

(async () => {
  await carregarPlanos();
  iniciarMatriculas();
  iniciarEquipamentos();
})();

// --- Expor funções para HTML ---

window.fazerLogin = fazerLogin;
window.mostrarSecao = mostrarSecao;

window.cadastrarEquipamento = cadastrarEquipamento;
window.editarEquipamento = editarEquipamento;
window.removerEquipamento = removerEquipamento;

window.cadastrarAluno = cadastrarAluno;
window.removerMatricula = removerMatricula;
