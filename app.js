// O front-end utiliza a API REST do Spring Boot. Para testar sem o backend,
 // mantenha DEMO_MODE como true: os dados ficam salvos no localStorage do navegador.
const API_URL = "http://localhost:8080/api";
const DEMO_MODE = true;
const money = value => Number(value || 0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const today = new Date().toISOString().slice(0,10);
let transactions = [];
let bills = [];
let financeChart, distributionChart;

function loadDemo(){
  transactions = JSON.parse(localStorage.getItem("fc_transactions") || "null") || [
    {id:1,description:"Salário",category:"Trabalho",type:"INCOME",amount:3500,date:today},
    {id:2,description:"Supermercado",category:"Alimentação",type:"EXPENSE",amount:420.50,date:today},
    {id:3,description:"Internet",category:"Moradia",type:"EXPENSE",amount:99.90,date:today},
    {id:4,description:"Projeto freelancer",category:"Extra",type:"INCOME",amount:650,date:today}
  ];
  bills = JSON.parse(localStorage.getItem("fc_bills") || "null") || [
    {id:1,description:"Conta de energia",amount:145.70,dueDate:today,paid:false},
    {id:2,description:"Aluguel",amount:900,dueDate:today,paid:false}
  ];
  saveDemo();
}
function saveDemo(){localStorage.setItem("fc_transactions",JSON.stringify(transactions));localStorage.setItem("fc_bills",JSON.stringify(bills));}
async function api(path, options={}){
  const response=await fetch(`${API_URL}${path}`,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}});
  if(!response.ok) throw new Error("Não foi possível concluir a operação na API.");
  if(response.status===204)return null;
  return response.json();
}
async function refresh(){
  if(!DEMO_MODE){
    try{[transactions,bills]=await Promise.all([api("/transactions"),api("/bills")]);}
    catch(error){alert(error.message+" Confira se o Spring Boot está rodando.");return;}
  }
  render();
}
function render(){
  const income=transactions.filter(t=>t.type==="INCOME").reduce((s,t)=>s+Number(t.amount),0);
  const expense=transactions.filter(t=>t.type==="EXPENSE").reduce((s,t)=>s+Number(t.amount),0);
  document.getElementById("balanceValue").textContent=money(income-expense);
  document.getElementById("incomeValue").textContent=money(income);
  document.getElementById("expenseValue").textContent=money(expense);
  document.getElementById("billsValue").textContent=bills.filter(b=>!b.paid).length;
  renderTransactions();renderBills();renderCharts(income,expense);
}
function renderTransactions(){
  const body=document.getElementById("transactionTable");
  if(!transactions.length){body.innerHTML='<tr><td colspan="6" class="empty-state">Nenhuma movimentação cadastrada.</td></tr>';return;}
  body.innerHTML=transactions.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`
    <tr><td><strong>${escapeHtml(t.description)}</strong></td><td>${escapeHtml(t.category)}</td>
    <td>${new Date(`${t.date}T12:00:00`).toLocaleDateString("pt-BR")}</td>
    <td><span class="type-pill ${t.type==="INCOME"?"type-income":"type-expense"}">${t.type==="INCOME"?"Receita":"Despesa"}</span></td>
    <td class="${t.type==="INCOME"?"amount-income":"amount-expense"}">${t.type==="INCOME"?"+":"−"} ${money(t.amount)}</td>
    <td><button class="delete-btn" title="Excluir" data-delete-transaction="${t.id}">×</button></td></tr>`).join("");
}
function renderBills(){
  const list=document.getElementById("billsList"), open=bills.filter(b=>!b.paid);
  if(!open.length){list.innerHTML='<p class="empty-state">Nenhuma conta pendente. Tudo em dia!</p>';return;}
  list.innerHTML=open.map(b=>`<div class="bill-item"><div><strong>${escapeHtml(b.description)}</strong><small>Vence em ${new Date(`${b.dueDate}T12:00:00`).toLocaleDateString("pt-BR")}</small></div><div class="bill-right"><b>${money(b.amount)}</b><button data-pay-bill="${b.id}">Marcar como paga ✓</button></div></div>`).join("");
}
function renderCharts(income,expense){
  if(!window.Chart)return;
  if(financeChart)financeChart.destroy();if(distributionChart)distributionChart.destroy();
  financeChart=new Chart(document.getElementById("financeChart"),{type:"bar",data:{labels:["Receitas","Despesas"],datasets:[{data:[income,expense],backgroundColor:["#27b58b","#e56b78"],borderRadius:7,maxBarThickness:48}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:"#f0f1f5"},ticks:{font:{size:9},callback:v=>"R$ "+v}},x:{grid:{display:false},ticks:{font:{size:10}}}}}});
  distributionChart=new Chart(document.getElementById("distributionChart"),{type:"doughnut",data:{labels:["Receitas","Despesas"],datasets:[{data:[income,expense],backgroundColor:["#27b58b","#e56b78"],borderWidth:0,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:"72%",plugins:{legend:{display:false}}}});
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function openModal(id){document.getElementById(id).classList.add("open");}
function closeModal(id){document.getElementById(id).classList.remove("open");}
document.getElementById("newTransactionBtn").addEventListener("click",()=>openModal("transactionModal"));
document.getElementById("newBillBtn").addEventListener("click",()=>openModal("billModal"));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m.id);}));
document.getElementById("transactionForm").addEventListener("submit",async e=>{
  e.preventDefault();const f=new FormData(e.target);
  const item={description:f.get("description").trim(),category:f.get("category").trim(),type:f.get("type"),amount:Number(f.get("amount")),date:f.get("date")};
  try{if(DEMO_MODE){item.id=Date.now();transactions.push(item);saveDemo();}else await api("/transactions",{method:"POST",body:JSON.stringify(item)});e.target.reset();closeModal("transactionModal");await refresh();}
  catch(err){document.getElementById("transactionMessage").textContent=err.message;}
});
document.getElementById("billForm").addEventListener("submit",async e=>{
  e.preventDefault();const f=new FormData(e.target);const item={description:f.get("description").trim(),amount:Number(f.get("amount")),dueDate:f.get("dueDate"),paid:false};
  try{if(DEMO_MODE){item.id=Date.now();bills.push(item);saveDemo();}else await api("/bills",{method:"POST",body:JSON.stringify(item)});e.target.reset();closeModal("billModal");await refresh();}
  catch(err){document.getElementById("billMessage").textContent=err.message;}
});
document.addEventListener("click",async e=>{
  const del=e.target.closest("[data-delete-transaction]"),pay=e.target.closest("[data-pay-bill]");
  try{
    if(del){const id=Number(del.dataset.deleteTransaction);if(DEMO_MODE){transactions=transactions.filter(t=>t.id!==id);saveDemo();}else await api(`/transactions/${id}`,{method:"DELETE"});await refresh();}
    if(pay){const id=Number(pay.dataset.payBill);if(DEMO_MODE){bills=bills.map(b=>b.id===id?{...b,paid:true}:b);saveDemo();}else await api(`/bills/${id}/pay`,{method:"PATCH"});await refresh();}
  }catch(err){alert(err.message);}
});
document.getElementById("seeAllBtn").addEventListener("click",refresh);
document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=>{document.querySelectorAll(".nav-link").forEach(a=>a.classList.remove("active"));link.classList.add("active");}));
document.querySelectorAll('input[type="date"]').forEach(input=>input.value=today);
loadDemo();refresh();

// Para conectar o front-end ao Spring Boot: altere DEMO_MODE para false.
// O backend oferece endpoints REST descritos no README.md.
