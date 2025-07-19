// js/client.js

import { db } from './firebase-config.js';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const form = document.getElementById('form-matricula');
const selectPlanos = document.getElementById('planos');
const servicosPlanoDiv = document.getElementById('servicos-plano');

// Menu hambúrguer
function toggleMenu() {
  nav.classList.toggle('show');
  hamburger.classList.toggle('active');
}
hamburger.addEventListener('click', toggleMenu);
hamburger.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMenu();
  }
});

// Atualiza serviços do plano (pode usar objeto static ou ler do texto)
const planosInfo = {
  basico:   ["Musculação","Spinning","Aulas Funcionais"],
  plus:     ["Todos do Básico","Cross Training","Zumba","Acompanhamento Nutricional"],
  premium:  ["Todos do Plus","Personal Trainer","Treino Feminino","Plano Dieta Exclusivo"]
};

selectPlanos.addEventListener('change', () => {
  const id = selectPlanos.value;
  const servs = planosInfo[id] || [];
  servicosPlanoDiv.textContent = servs.length
    ? `Serviços incluídos: ${servs.join(', ')}`
    : 'Escolha um plano para ver os serviços incluídos.';
});

// Botão “Contratar”
window.contratarPlano = function(id) {
  selectPlanos.value = id;
  selectPlanos.dispatchEvent(new Event('change'));
  form.scrollIntoView({ behavior: 'smooth' });
};

// Envio do formulário
form.addEventListener('submit', async e => {
  e.preventDefault();
  const nome  = document.getElementById('nome').value.trim();
  const tel   = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();
  const pagamento = document.getElementById('pagamento').value;
  const idPlano   = selectPlanos.value;
  const txtPlano  = selectPlanos.options[selectPlanos.selectedIndex].text;

  if (!nome||!tel||!email||!pagamento||!idPlano) {
    return alert("Preencha todos os campos e escolha um plano.");
  }

  try {
    await addDoc(collection(db,'matriculas'), {
      nome,
      telefone: tel,
      email,
      formaPagamento: pagamento,
      planoId: idPlano,
      planoNome: txtPlano,
      dataCadastro: serverTimestamp()
    });
    alert("Matrícula realizada com sucesso!");
    form.reset();
    servicosPlanoDiv.textContent = "Escolha um plano para ver os serviços incluídos.";
  } catch(err) {
    console.error(err);
    alert("Erro ao realizar matrícula.");
  }
});

