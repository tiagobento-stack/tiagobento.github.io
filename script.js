
function moneyEUR(value){
  return new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(value);
}
function integer(value){
  return new Intl.NumberFormat('pt-PT').format(value);
}
function setHtml(id, html){
  const el = document.getElementById(id);
  if(el){ el.innerHTML = html; }
}
function safeText(text){
  return String(text).replace(/[&<>"]/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.tool || '';
  if(page === 'percentagens') initPercentagens();
  if(page === 'dividir-conta') initDividirConta();
  if(page === 'diferenca-datas') initDiferencaDatas();
  if(page === 'sorteador-nomes') initSorteador();
  if(page === 'cara-ou-coroa') initCaraOuCoroa();
  if(page === 'dado-online') initDado();
  if(page === 'pomodoro') initPomodoro();
  if(page === 'simulador-poupanca') initPoupanca();
  if(page === 'contador-regressivo') initCountdown();
  if(page === 'gerador-usernames') initUsernames();
  if(page === 'calculadora-imc') initIMC();
  if(page === 'regra-de-tres') initRegraTres();
  if(page === 'media-notas') initMediaNotas();
  if(page === 'sorteador-numero') initSorteadorNumero();
  if(page === 'gerador-passwords') initPasswords();
  if(page === 'contador-caracteres') initContadorCaracteres();
  if(page === 'removedor-espacos') initRemovedorEspacos();
  if(page === 'conversor-tempo') initConversorTempo();
  if(page === 'calculadora-idade') initCalculadoraIdade();
  if(page === 'orcamento-mensal') initOrcamentoMensal();
});

function initPercentagens(){
  const total = document.getElementById('percent-total');
  const percent = document.getElementById('percent-value');
  const btn = document.getElementById('percent-btn');
  const result = document.getElementById('percent-result');
  function calc(){
    const t = parseFloat(total.value.replace(',', '.'));
    const p = parseFloat(percent.value.replace(',', '.'));
    if(Number.isNaN(t) || Number.isNaN(p)){ setHtml('percent-result', '<strong>Preencha os dois campos.</strong>'); return; }
    const v = (t * p) / 100;
    setHtml('percent-result', `<strong>${p}% de ${t} é ${v.toFixed(2)}</strong><div class="muted">Também pode usar esta conta para descontos, comissões e IVA.</div>`);
  }
  btn?.addEventListener('click', calc);
}

function initDividirConta(){
  const total = document.getElementById('bill-total');
  const people = document.getElementById('bill-people');
  const tip = document.getElementById('bill-tip');
  function calc(){
    const t = parseFloat(total.value.replace(',', '.'));
    const p = parseInt(people.value, 10);
    const g = parseFloat(tip.value.replace(',', '.')) || 0;
    if(Number.isNaN(t) || Number.isNaN(p) || p < 1){ setHtml('bill-result', '<strong>Preencha um total válido e o número de pessoas.</strong>'); return; }
    const totalComGorjeta = t + (t * g / 100);
    const porPessoa = totalComGorjeta / p;
    setHtml('bill-result', `<strong>Cada pessoa paga ${moneyEUR(porPessoa)}</strong><div class="muted">Total com gorjeta: ${moneyEUR(totalComGorjeta)} · Pessoas: ${integer(p)}</div>`);
  }
  document.getElementById('bill-btn')?.addEventListener('click', calc);
}

function initDiferencaDatas(){
  function calc(){
    const start = document.getElementById('date-start').value;
    const end = document.getElementById('date-end').value;
    if(!start || !end){ setHtml('date-result', '<strong>Escolha as duas datas.</strong>'); return; }
    const a = new Date(start + 'T00:00:00');
    const b = new Date(end + 'T00:00:00');
    const diffMs = b - a;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const abs = Math.abs(diffDays);
    const weeks = Math.floor(abs / 7);
    const monthsApprox = (abs / 30.44).toFixed(1);
    const direction = diffDays >= 0 ? 'entre a primeira e a segunda data' : 'entre a segunda e a primeira data';
    setHtml('date-result', `<strong>Existem ${integer(abs)} dias ${direction}</strong><div class="muted">Aproximadamente ${integer(weeks)} semanas ou ${monthsApprox} meses.</div>`);
  }
  document.getElementById('date-btn')?.addEventListener('click', calc);
}

function initSorteador(){
  function draw(){
    const raw = document.getElementById('picker-names').value || '';
    const names = raw.split(/\n|,/).map(v => v.trim()).filter(Boolean);
    if(names.length < 2){ setHtml('picker-result', '<strong>Adicione pelo menos dois nomes.</strong>'); return; }
    const chosen = names[Math.floor(Math.random() * names.length)];
    setHtml('picker-result', `<strong>Escolhido: ${safeText(chosen)}</strong><div class="muted">Total de opções: ${integer(names.length)}. Pode voltar a sortear as vezes que quiser.</div>`);
  }
  document.getElementById('picker-btn')?.addEventListener('click', draw);
}

function initCaraOuCoroa(){
  const history = [];
  function flip(){
    const side = Math.random() < 0.5 ? 'Cara' : 'Coroa';
    history.unshift(side);
    const last = history.slice(0, 8).map(v => `<span class="badge">${v}</span>`).join(' ');
    setHtml('coin-result', `<strong>Resultado: ${side}</strong><div class="muted">Últimos lançamentos:</div><div class="inline-links" style="margin-top:8px">${last}</div>`);
  }
  document.getElementById('coin-btn')?.addEventListener('click', flip);
}

function initDado(){
  const history = [];
  function roll(){
    const value = Math.floor(Math.random() * 6) + 1;
    history.unshift(value);
    const avg = history.reduce((a,b)=>a+b,0) / history.length;
    setHtml('dice-result', `<strong>Saída: ${value}</strong><div class="muted">Média desta sessão: ${avg.toFixed(2)} · Lançamentos: ${integer(history.length)}</div>`);
  }
  document.getElementById('dice-btn')?.addEventListener('click', roll);
}

function initPomodoro(){
  let timer = null;
  let remaining = 25 * 60;
  function render(){
    const min = Math.floor(remaining / 60).toString().padStart(2, '0');
    const sec = (remaining % 60).toString().padStart(2, '0');
    setHtml('pomo-result', `<strong>${min}:${sec}</strong><div class="muted">Use sessões curtas de foco e depois faça uma pausa.</div>`);
    document.title = `${min}:${sec} · CliqueÚtil`;
  }
  function start(){
    if(timer) return;
    timer = setInterval(() => {
      remaining--;
      render();
      if(remaining <= 0){
        clearInterval(timer);
        timer = null;
        setHtml('pomo-result', '<strong>Sessão concluída.</strong><div class="muted">Faça uma pausa curta antes de recomeçar.</div>');
        document.title = 'Sessão concluída · CliqueÚtil';
      }
    }, 1000);
  }
  function pause(){
    clearInterval(timer);
    timer = null;
  }
  function reset(){
    pause();
    const mins = parseInt(document.getElementById('pomo-minutes').value, 10) || 25;
    remaining = Math.max(1, mins) * 60;
    render();
  }
  document.getElementById('pomo-start')?.addEventListener('click', start);
  document.getElementById('pomo-pause')?.addEventListener('click', pause);
  document.getElementById('pomo-reset')?.addEventListener('click', reset);
  render();
}

function initPoupanca(){
  function calc(){
    const monthly = parseFloat(document.getElementById('save-monthly').value.replace(',', '.'));
    const months = parseInt(document.getElementById('save-months').value, 10);
    const rate = parseFloat(document.getElementById('save-rate').value.replace(',', '.')) || 0;
    if(Number.isNaN(monthly) || Number.isNaN(months) || months < 1){
      setHtml('save-result', '<strong>Preencha os valores necessários.</strong>');
      return;
    }
    let balance = 0;
    const monthlyRate = rate / 100 / 12;
    for(let i=0; i<months; i++){
      balance = (balance + monthly) * (1 + monthlyRate);
    }
    const invested = monthly * months;
    const gain = balance - invested;
    setHtml('save-result', `<strong>Valor final estimado: ${moneyEUR(balance)}</strong><div class="muted">Total colocado: ${moneyEUR(invested)} · Ganho estimado: ${moneyEUR(gain)}</div>`);
  }
  document.getElementById('save-btn')?.addEventListener('click', calc);
}

function initCountdown(){
  let timer = null;
  function update(){
    const target = document.getElementById('countdown-target').value;
    if(!target){ setHtml('countdown-result', '<strong>Escolha data e hora.</strong>'); return; }
    const targetDate = new Date(target);
    const now = new Date();
    const diff = targetDate - now;
    if(diff <= 0){
      setHtml('countdown-result', '<strong>O momento já chegou.</strong>');
      if(timer){ clearInterval(timer); timer = null; }
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    setHtml('countdown-result', `<strong>${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos</strong><div class="muted">Contagem em tempo real até à data escolhida.</div>`);
  }
  document.getElementById('countdown-btn')?.addEventListener('click', () => {
    if(timer){ clearInterval(timer); }
    update();
    timer = setInterval(update, 1000);
  });
}

function initUsernames(){
  const starters = ['neo','lobo','nuvem','pixel','atlas','rubi','sombra','vento','aurora','norte','echo','solar'];
  const endings = ['pt','x','lab','zone','hub','nova','prime','flow','wave','spark','play','base'];
  function generate(){
    const number = Math.floor(Math.random() * 900) + 100;
    const out = [];
    for(let i=0;i<8;i++){
      const a = starters[Math.floor(Math.random() * starters.length)];
      const b = endings[Math.floor(Math.random() * endings.length)];
      out.push(`${a}${b}${number+i}`);
    }
    setHtml('usernames-result', `<strong>Ideias geradas</strong><div class="copy-box">${out.map(v => safeText(v)).join('<br>')}</div>`);
  }
  document.getElementById('usernames-btn')?.addEventListener('click', generate);
}


function initIMC(){
  function calc(){
    const weight = parseFloat(document.getElementById('imc-weight').value.replace(',', '.'));
    const heightCm = parseFloat(document.getElementById('imc-height').value.replace(',', '.'));
    if(Number.isNaN(weight) || Number.isNaN(heightCm) || heightCm <= 0){
      setHtml('imc-result', '<strong>Preencha peso e altura com valores válidos.</strong>');
      return;
    }
    const heightM = heightCm / 100;
    const imc = weight / (heightM * heightM);
    let label = 'faixa intermédia';
    if(imc < 18.5) label = 'abaixo da faixa intermédia';
    else if(imc >= 25 && imc < 30) label = 'acima da faixa intermédia';
    else if(imc >= 30) label = 'bastante acima da faixa intermédia';
    setHtml('imc-result', `<strong>IMC estimado: ${imc.toFixed(1)}</strong><div class="muted">Interpretação geral: ${label}. Este valor é apenas uma referência simples.</div>`);
  }
  document.getElementById('imc-btn')?.addEventListener('click', calc);
}

function initRegraTres(){
  function calc(){
    const a = parseFloat(document.getElementById('rule-a').value.replace(',', '.'));
    const b = parseFloat(document.getElementById('rule-b').value.replace(',', '.'));
    const c = parseFloat(document.getElementById('rule-c').value.replace(',', '.'));
    if([a,b,c].some(v => Number.isNaN(v)) || a === 0){
      setHtml('rule-result', '<strong>Preencha A, B e C com valores válidos.</strong>');
      return;
    }
    const x = (b * c) / a;
    setHtml('rule-result', `<strong>Valor de X: ${x.toFixed(2)}</strong><div class="muted">Conta usada: A : B = C : X, logo X = (B × C) ÷ A.</div>`);
  }
  document.getElementById('rule-btn')?.addEventListener('click', calc);
}

function initMediaNotas(){
  function calc(){
    const raw = document.getElementById('grades-values').value || '';
    const values = raw.split(/\n|,/).map(v => parseFloat(v.trim().replace(',', '.'))).filter(v => !Number.isNaN(v));
    if(values.length === 0){
      setHtml('grades-result', '<strong>Introduza pelo menos uma nota válida.</strong>');
      return;
    }
    const sum = values.reduce((a,b)=>a+b,0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    setHtml('grades-result', `<strong>Média simples: ${avg.toFixed(2)}</strong><div class="muted">Total de notas: ${integer(values.length)} · Mais alta: ${max} · Mais baixa: ${min}</div>`);
  }
  document.getElementById('grades-btn')?.addEventListener('click', calc);
}

function initSorteadorNumero(){
  const history = [];
  function draw(){
    const min = parseInt(document.getElementById('rand-min').value, 10);
    const max = parseInt(document.getElementById('rand-max').value, 10);
    if(Number.isNaN(min) || Number.isNaN(max) || max < min){
      setHtml('rand-result', '<strong>Defina um mínimo e um máximo válidos.</strong>');
      return;
    }
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    history.unshift(value);
    const last = history.slice(0, 8).map(v => `<span class="badge">${v}</span>`).join(' ');
    setHtml('rand-result', `<strong>Número sorteado: ${value}</strong><div class="muted">Intervalo: ${min} a ${max}</div><div class="inline-links" style="margin-top:8px">${last}</div>`);
  }
  document.getElementById('rand-btn')?.addEventListener('click', draw);
}

function initPasswords(){
  function generate(){
    const length = parseInt(document.getElementById('pass-length').value, 10);
    const count = parseInt(document.getElementById('pass-count').value, 10);
    if(Number.isNaN(length) || Number.isNaN(count) || length < 6 || count < 1){
      setHtml('pass-result', '<strong>Defina valores válidos para comprimento e quantidade.</strong>');
      return;
    }
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';
    const out = [];
    for(let i=0; i<Math.min(count,10); i++){
      let pass = '';
      for(let j=0; j<length; j++){
        pass += chars[Math.floor(Math.random() * chars.length)];
      }
      out.push(pass);
    }
    setHtml('pass-result', `<strong>Passwords geradas</strong><pre>${safeText(out.join('\n'))}</pre>`);
  }
  document.getElementById('pass-btn')?.addEventListener('click', generate);
}

function initContadorCaracteres(){
  function count(){
    const text = document.getElementById('count-text').value || '';
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = (text.trim().match(/\S+/g) || []).length;
    const lines = text === '' ? 0 : text.split(/\n/).length;
    setHtml('count-result', `<strong>${integer(chars)} caracteres</strong><div class="muted">Sem espaços: ${integer(charsNoSpaces)} · Palavras: ${integer(words)} · Linhas: ${integer(lines)}</div>`);
  }
  document.getElementById('count-btn')?.addEventListener('click', count);
}

function initRemovedorEspacos(){
  function clean(){
    const text = document.getElementById('clean-text').value || '';
    if(!text.trim()){
      setHtml('clean-result', '<strong>Cole algum texto antes de limpar.</strong>');
      return;
    }
    const cleaned = text.split(/\n/).map(line => line.trim().replace(/\s+/g, ' ')).filter(Boolean).join('\n');
    setHtml('clean-result', `<strong>Texto limpo</strong><pre>${safeText(cleaned)}</pre>`);
  }
  document.getElementById('clean-btn')?.addEventListener('click', clean);
}

function initConversorTempo(){
  function convert(){
    const value = parseFloat(document.getElementById('time-value').value.replace(',', '.'));
    const unit = document.getElementById('time-unit').value;
    if(Number.isNaN(value)){
      setHtml('time-result', '<strong>Introduza um valor válido.</strong>');
      return;
    }
    let hours = value;
    if(unit === 'days') hours = value * 24;
    if(unit === 'weeks') hours = value * 24 * 7;
    const days = hours / 24;
    const weeks = days / 7;
    setHtml('time-result', `<strong>${hours.toFixed(2)} horas</strong><div class="muted">${days.toFixed(2)} dias · ${weeks.toFixed(2)} semanas</div>`);
  }
  document.getElementById('time-btn')?.addEventListener('click', convert);
}

function initCalculadoraIdade(){
  function calc(){
    const birth = document.getElementById('age-birth').value;
    if(!birth){
      setHtml('age-result', '<strong>Escolha a data de nascimento.</strong>');
      return;
    }
    const now = new Date();
    const b = new Date(birth + 'T00:00:00');
    let years = now.getFullYear() - b.getFullYear();
    const monthDiff = now.getMonth() - b.getMonth();
    if(monthDiff < 0 || (monthDiff === 0 && now.getDate() < b.getDate())) years--;
    const diffDays = Math.floor((now - b) / (1000 * 60 * 60 * 24));
    const monthsApprox = Math.floor(diffDays / 30.44);
    setHtml('age-result', `<strong>Idade atual: ${integer(years)} anos</strong><div class="muted">Aproximadamente ${integer(monthsApprox)} meses ou ${integer(diffDays)} dias.</div>`);
  }
  document.getElementById('age-btn')?.addEventListener('click', calc);
}

function initOrcamentoMensal(){
  function calc(){
    const income = parseFloat(document.getElementById('budget-income').value.replace(',', '.'));
    const fixed = parseFloat(document.getElementById('budget-fixed').value.replace(',', '.'));
    const other = parseFloat(document.getElementById('budget-other').value.replace(',', '.')) || 0;
    if([income,fixed].some(v => Number.isNaN(v))){
      setHtml('budget-result', '<strong>Preencha rendimento e despesas fixas com valores válidos.</strong>');
      return;
    }
    const totalExpenses = fixed + other;
    const remaining = income - totalExpenses;
    const rate = income === 0 ? 0 : (remaining / income) * 100;
    setHtml('budget-result', `<strong>Margem do mês: ${moneyEUR(remaining)}</strong><div class="muted">Despesas totais: ${moneyEUR(totalExpenses)} · Percentagem livre: ${rate.toFixed(1)}%</div>`);
  }
  document.getElementById('budget-btn')?.addEventListener('click', calc);
}
