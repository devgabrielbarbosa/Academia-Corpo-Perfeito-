// Navegação das seções
document.querySelectorAll('nav.tabs button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#sistemaContainer > div.secao').forEach(s=>s.style.display='none');
    document.getElementById(btn.dataset.secao).style.display='block';
  });
});

// Dados fictícios academia grande
const dashboardFicticio = {
  alunosAtivos: 130,
  alunosPendentes: 40,
  equipamentosOperacionais: 25,
  equipamentosManutencao: 10,
  equipamentosQuebrados: 5,
  planos: [
    { nome: "Mensal", quantidade: 80 },
    { nome: "Trimestral", quantidade: 30 },
    { nome: "Anual", quantidade: 20 }
  ],
  faturamento: {
    diario: [1200,1350,1400,1250,1500,1450,1600],
    semanal: [8000,9000,7500,10000],
    mensal: [25000,27000,22000,30000,28000,26000,31000,32000,29000,33000,34000,35000],
    anual: [300000,320000,350000,400000,450000]
  }
};

// Atualiza cards
document.getElementById("totalAlunos").textContent = dashboardFicticio.alunosAtivos;
document.getElementById("alunosPendentes").textContent = dashboardFicticio.alunosPendentes;
document.getElementById("equipOperacionais").textContent = dashboardFicticio.equipamentosOperacionais;
document.getElementById("equipManutencao").textContent = dashboardFicticio.equipamentosManutencao;
document.getElementById("equipQuebrados").textContent = dashboardFicticio.equipamentosQuebrados;

// Gráfico Alunos por plano
const ctxAlunos = document.getElementById("graficoAlunos").getContext("2d");
new Chart(ctxAlunos,{
  type:'bar',
  data:{
    labels: dashboardFicticio.planos.map(p=>p.nome),
    datasets:[{
      label:'Alunos por plano',
      data: dashboardFicticio.planos.map(p=>p.quantidade),
      backgroundColor:['#e74c3c','#f1c40f','#2ecc71'],
      borderRadius:8,
      borderSkipped:false
    }]
  },
  options:{
    responsive:true,
    plugins:{legend:{display:false}},
    scales:{y:{beginAtZero:true}}
  }
});

// Gráfico Faturamento
const ctxFaturamento = document.getElementById("graficoFaturamento").getContext("2d");
new Chart(ctxFaturamento, {
  type: 'line',
  data: {
    labels: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
    datasets: [
      {
        label: 'Faturamento Diário',
        data: [1200,1350,1400,1250,1500,1450,1600],
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39,174,96,0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  },
  options: { responsive: true }
});
