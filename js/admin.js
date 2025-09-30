// admin.js
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

// --- REFERÊNCIAS ---
const equipamentosRef = collection(db, "equipamentos");
const planosRef = collection(db, "planos");
const matriculasRef = collection(db, "matriculas");

const listaEquipamentos = document.getElementById("listaEquipamentos");
const listaMatriculas = document.getElementById("lista-alunos");
const planosCache = new Map();

// --- EQUIPAMENTOS ---
function iniciarEquipamentos() {
  if (!listaEquipamentos) return;
  const q = query(equipamentosRef);
  onSnapshot(q, snapshot => {
    listaEquipamentos.innerHTML = "";
    snapshot.forEach(docSnap => {
      const dados = docSnap.data();
      const tr = document.createElement("tr");
      tr.dataset.id = docSnap.id;
      tr.innerHTML = `
        <td>${dados.nome || "-"}</td>
        <td>${dados.status || "-"}</td>
        <td><button onclick="editarEquipamento('${docSnap.id}')">Editar</button></td>
        <td><button onclick="removerEquipamento('${docSnap.id}')">Remover</button></td>
      `;
      listaEquipamentos.appendChild(tr);
    });
  });
}

async function cadastrarEquipamento() {
  const nome = document.getElementById('nomeEquipamento').value.trim();
  const status = document.getElementById('statusEquipamento').value;
  if (!nome) return alert("Preencha o nome do equipamento!");
  try {
    await addDoc(equipamentosRef, { nome, status, criadoEm: serverTimestamp() });
    document.getElementById('nomeEquipamento').value = '';
    document.getElementById('statusEquipamento').value = 'Operacional';
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar equipamento.");
  }
}

async function removerEquipamento(id) {
  if (!confirm("Tem certeza que deseja remover este equipamento?")) return;
  try {
    await deleteDoc(doc(db, "equipamentos", id));
  } catch (err) {
    console.error(err);
    alert("Erro ao remover equipamento.");
  }
}

async function editarEquipamento(id) {
  try {
    const docRef = doc(db, "equipamentos", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return alert("Equipamento não encontrado!");
    const dados = docSnap.data();
    const novoNome = prompt("Editar nome:", dados.nome);
    if (!novoNome) return;
    const novoStatus = prompt("Editar status (Operacional, Em Manutenção, Quebrado):", dados.status);
    if (!novoStatus) return;
    await updateDoc(docRef, { nome: novoNome.trim(), status: novoStatus.trim() });
  } catch (err) {
    console.error(err);
    alert("Erro ao editar equipamento.");
  }
}

// --- PLANOS ---
async function carregarPlanos() {
  try {
    const snapshot = await getDocs(planosRef);
    planosCache.clear();
    snapshot.forEach(doc => planosCache.set(doc.id, doc.data()));

    preencherSelectPlanos(); // <-- aqui chama a função para preencher o select
  } catch (err) {
    console.error("Erro ao carregar planos:", err);
  }
}

// --- Preenche o select de planos ---
function preencherSelectPlanos() {
  const select = document.getElementById("planoAluno"); // ou o ID do seu select
  if (!select) return;

  select.innerHTML = '<option value="">Selecione um plano</option>';
  planosCache.forEach((plano, id) => {
    const opt = document.createElement("option");
    opt.value = id;        // o value é o ID do plano
    opt.textContent = plano.nome; // mostra o nome do plano
    select.appendChild(opt);
  });
}

// --- MATRÍCULAS ---
function iniciarMatriculas() {
  if (!listaMatriculas) return;
  const qMatriculas = query(matriculasRef);
  onSnapshot(qMatriculas, snapshot => {
    listaMatriculas.innerHTML = "";
    snapshot.forEach(docSnap => {
      const dados = docSnap.data();
      const nomePlano = dados.planoNome || "Plano não encontrado";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${dados.nome || "-"}</td>
        <td>${nomePlano}</td>
        <td>${dados.email || "-"}</td>
        <td>${dados.telefone || "-"}</td>
        <td>${dados.cpf || "-"}</td>
        <td>${dados.formaPagamento || "-"}</td>
        <td><button onclick="removerMatricula('${docSnap.id}')">Remover</button></td>
      `;
      listaMatriculas.appendChild(tr);
    });
  });
}

async function removerMatricula(id) {
  if (!confirm("Tem certeza que deseja remover esta matrícula?")) return;
  try {
    await deleteDoc(doc(db, "matriculas", id));
  } catch(err) {
    console.error(err);
    alert("Erro ao remover matrícula.");
  }
}

// --- CADASTRO DE ALUNOS ---
async function cadastrarAluno(event) {
  event.preventDefault();
  const n = document.getElementById("nomeAluno").value.trim();
  const p = document.getElementById("planoAluno").value;
  const e = document.getElementById("emailAluno").value.trim();
  const t = document.getElementById("telefoneAluno").value.trim();
  const c = document.getElementById("cpfAluno").value.trim();
  const f = document.getElementById("pagamentoAluno").value.trim();
  if (!n || !p || !e || !t || !c || !f) return alert("Preencha todos os campos!");
  try {
    const planoNome = planosCache.get(p)?.nome || "Plano não encontrado";
    await addDoc(matriculasRef, {
      nome: n,
      planoId: p,
      planoNome,
      email: e,
      telefone: t,
      cpf: c,
      formaPagamento: f,
      dataCadastro: serverTimestamp()
    });
    ["nomeAluno", "planoAluno", "emailAluno", "telefoneAluno", "cpfAluno", "pagamentoAluno"].forEach(id => document.getElementById(id).value = "");
    alert("Aluno cadastrado com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar aluno.");
  }
}

// --- LOGIN SIMPLES ---
function fazerLogin() {
  const u = document.getElementById("usuario").value;
  const s = document.getElementById("senha").value;
  if (u === "admin" && s === "1234") {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("sistemaContainer").style.display = "block";
    mostrarSecao("alunos");
  } else alert("Usuário ou senha incorretos!");
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

// --- INICIALIZAÇÃO ---
(async () => {
  await carregarPlanos();
  iniciarMatriculas();
  iniciarEquipamentos();
})();

// --- EXPOR FUNÇÕES PARA HTML ---
window.fazerLogin = fazerLogin;
window.mostrarSecao = mostrarSecao;
window.cadastrarEquipamento = cadastrarEquipamento;
window.editarEquipamento = editarEquipamento;
window.removerEquipamento = removerEquipamento;
window.cadastrarAluno = cadastrarAluno;
window.removerMatricula = removerMatricula;



