const alvos = [
    {
        numero: 1,
        inimigo: "Golem Embarcado",
        sigil: "⚙️",
        direcao: "H",
        resposta: "MICROCONTROLADOR",
        pista: "Chip único que integra processador, memória e periféricos para sistemas embarcados."
    },
    {
        numero: 2,
        inimigo: "Sombra Veloz",
        sigil: "⚡",
        direcao: "V",
        resposta: "CACHE",
        pista: "Memória ultrarrápida próxima ao processador que guarda dados mais acessados."
    },
    {
        numero: 3,
        inimigo: "Lâmina Não-Volátil",
        sigil: "🗡️",
        direcao: "H",
        resposta: "FLASH",
        pista: "Memória não volátil muito usada em pendrives e SSDs."
    },
    {
        numero: 4,
        inimigo: "Soberano do Núcleo",
        sigil: "👑",
        direcao: "V",
        resposta: "CPU",
        pista: "Cérebro do computador que executa instruções e processa programas."
    },
    {
        numero: 5,
        inimigo: "Titã dos Arquivos",
        sigil: "🗿",
        direcao: "H",
        resposta: "MEMORIADEMASSA",
        pista: "Armazenamento permanente de grande capacidade para arquivos, como HDs."
    },
    {
        numero: 6,
        inimigo: "Espíritos do Clock",
        sigil: "✨",
        direcao: "V",
        resposta: "REGISTRADORES",
        pista: "Pequenas memórias internas do processador com velocidade máxima de acesso."
    },
    {
        numero: 7,
        inimigo: "Rastreador de Endereços",
        sigil: "🎯",
        direcao: "H",
        resposta: "ADDRESSBUS",
        pista: "Via unidirecional que transporta a localização física de um dado."
    },
    {
        numero: 8,
        inimigo: "Arauto Lógico-Aritmético",
        sigil: "🔮",
        direcao: "V",
        resposta: "ULA",
        pista: "Componente interno que realiza cálculos matemáticos e comparações booleanas."
    },
    {
        numero: 9,
        inimigo: "Via de Fluxo Duplo",
        sigil: "🌊",
        direcao: "H",
        resposta: "DATABUS",
        pista: "Via bidirecional por onde trafegam as informações entre componentes."
    },
    {
        numero: 10,
        inimigo: "Fantasma Volátil",
        sigil: "👻",
        direcao: "V",
        resposta: "RAM",
        pista: "Memória principal volátil que perde os dados ao desligar."
    },
    {
        numero: 11,
        inimigo: "Infiltrador Direto",
        sigil: "🥷",
        direcao: "H",
        resposta: "DMA",
        pista: "Recurso que permite periféricos acessarem a RAM sem sobrecarregar o processador."
    },
    {
        numero: 12,
        inimigo: "Guardião do Boot",
        sigil: "🛡️",
        direcao: "V",
        resposta: "ROM",
        pista: "Memória apenas de leitura que guarda o firmware de inicialização."
    }
];

let indiceAtual = 0;
let combo = 0;
const resolvidos = Array(alvos.length).fill(false);
const tentativasDigitadas = Array(alvos.length).fill("");

const battleStageEl = document.getElementById("battle-stage");
const alvoDirecaoEl = document.getElementById("alvo-direcao");
const inimigoNomeEl = document.getElementById("inimigo-nome");
const alvoNumeroEl = document.getElementById("alvo-numero");
const hpTextoEl = document.getElementById("hp-texto");
const hpBarFillEl = document.getElementById("hp-bar-fill");
const avatarSigilEl = document.getElementById("avatar-sigil");
const avatarSubEl = document.getElementById("avatar-sub");
const slashFxEl = document.getElementById("slash-fx");
const pistaAtivaEl = document.getElementById("pista-ativa");
const inputRespostaEl = document.getElementById("input-resposta");
const feedbackMsgEl = document.getElementById("feedback-msg");
const contadorAcertosEl = document.getElementById("contador-acertos");
const comboDisplayEl = document.getElementById("combo-display");
const listaHorizontaisEl = document.getElementById("lista-horizontais");
const listaVerticaisEl = document.getElementById("lista-verticais");

const btnConferir = document.getElementById("btn-conferir");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnProximo = document.getElementById("btn-proximo");
const scoreDisplayEl = document.getElementById("score-display");
const timerDisplayEl = document.getElementById("timer-display");
const btnDica = document.getElementById("btn-dica");
let score = 0;
let segundosDecorridos = 0;
let timerInterval = null;
function atualizarHud() {
    const acertos = resolvidos.filter(Boolean).length;
    contadorAcertosEl.textContent = `${acertos} de ${alvos.length} palavras`;
    scoreDisplayEl.textContent = `${score} PTS`;
    comboDisplayEl.textContent = `${combo}x`;
}

function renderizarListas() {
    listaHorizontaisEl.innerHTML = "";
    listaVerticaisEl.innerHTML = "";

    alvos.forEach((alvo, idx) => {
        const li = document.createElement("li");
        li.classList.add("target-item");

        if (idx === indiceAtual) {
            li.classList.add("selecionado");
        }
        if (resolvidos[idx]) {
            li.classList.add("derrotado");
        }

        const statusTexto = resolvidos[idx] ? "DERROTADO" : "ALVO";
        const pillClasse = resolvidos[idx] ? "pill-derrotado" : "pill-ativo";

        li.innerHTML = `
            <span><strong>#${alvo.numero}</strong> ${alvo.inimigo}</span>
            <span class="status-pill ${pillClasse}">${statusTexto}</span>
        `;

        li.addEventListener("click", () => {
            tentativasDigitadas[indiceAtual] = inputRespostaEl.value;
            indiceAtual = idx;
            feedbackMsgEl.textContent = "";
            feedbackMsgEl.className = "feedback-msg";
            renderizarArena();
            renderizarListas();
        });

        if (alvo.direcao === "H") {
            listaHorizontaisEl.appendChild(li);
        } else {
            listaVerticaisEl.appendChild(li);
        }
    });
}

function iniciarTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        segundosDecorridos++;
        const min = String(Math.floor(segundosDecorridos / 60)).padStart(2, "0");
        const seg = String(segundosDecorridos % 60).padStart(2, "0");
        timerDisplayEl.textContent = `${min}:${seg}`;
    }, 1000);
}

function renderizarArena() {
    const alvo = alvos[indiceAtual];
    const derrotado = resolvidos[indiceAtual];

    alvoDirecaoEl.textContent = alvo.direcao === "H" ? "HORIZONTAL" : "VERTICAL";
    inimigoNomeEl.textContent = alvo.inimigo;
    alvoNumeroEl.textContent = `#${String(alvo.numero).padStart(2, "0")}`;
    avatarSigilEl.textContent = derrotado ? "💥" : alvo.sigil;
    avatarSubEl.textContent = derrotado
        ? `SELO QUEBRADO: ${alvo.resposta}`
        : `LETRAS DO SELO: ${alvo.resposta.length}`;
    pistaAtivaEl.textContent = alvo.pista;

    if (derrotado) {
        hpTextoEl.textContent = "0 / 100";
        hpBarFillEl.style.width = "0%";
        inputRespostaEl.value = alvo.resposta;
        inputRespostaEl.disabled = true;
        renderizarSlots(alvo.resposta, true);
    } else {
        hpTextoEl.textContent = "100 / 100";
        hpBarFillEl.style.width = "100%";
        inputRespostaEl.value = tentativasDigitadas[indiceAtual] || "";
        inputRespostaEl.disabled = false;
        inputRespostaEl.focus();
        renderizarSlots(tentativasDigitadas[indiceAtual] || "", false);
    }
}

function usarScanner() {
    if (resolvidos[indiceAtual]) return;

    const alvo = alvos[indiceAtual];
    const atual = inputRespostaEl.value;
    let novoTexto = "";
    let revelou = false;

    for (let i = 0; i < alvo.resposta.length; i++) {
        if (!revelou && atual[i] !== alvo.resposta[i]) {
            novoTexto += alvo.resposta[i];
            revelou = true;
        } else {
            novoTexto += atual[i] || "";
        }
    }

    combo = 0;
    score = Math.max(0, score - 150);
    inputRespostaEl.value = novoTexto;
    tentativasDigitadas[indiceAtual] = novoTexto;

    feedbackMsgEl.textContent = "SCANNER ATIVADO! Uma letra do núcleo foi revelada (-150 PTS).";
    feedbackMsgEl.className = "feedback-msg";

    atualizarHud();
    renderizarSlots(novoTexto, false);
    inputRespostaEl.focus();
}

function dispararSlash() {
    slashFxEl.classList.add("ativo");
    setTimeout(() => {
        slashFxEl.classList.remove("ativo");
    }, 450);
}

function tremerArena() {
    battleStageEl.classList.remove("hit-shake");
    void battleStageEl.offsetWidth;
    battleStageEl.classList.add("hit-shake");
}

function conferirAtaque() {
    const alvo = alvos[indiceAtual];
    const palpite = inputRespostaEl.value
    
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z]/g, "");
        combo++;
score += 250 + (combo * 50);

    tentativasDigitadas[indiceAtual] = palpite;

    if (!palpite) {
        feedbackMsgEl.textContent = "Digite uma palavra antes de conferir!";
        feedbackMsgEl.className = "feedback-msg erro";
        tremerArena();
        return;
    }

    if (palpite === alvo.resposta) {
        if (!resolvidos[indiceAtual]) {
            resolvidos[indiceAtual] = true;
            combo++;
            dispararSlash();
        }
        feedbackMsgEl.textContent = `GOLPE CRÍTICO! ${alvo.resposta} quebrou o selo de ${alvo.inimigo}!`;
        feedbackMsgEl.className = "feedback-msg ok";
    } else {
        combo = 0;
        tremerArena();
        feedbackMsgEl.textContent = `ERRADO! "${palpite}" não corresponde a este núcleo. Tente novamente!`;
        feedbackMsgEl.className = "feedback-msg erro";
    }

    atualizarHud();
    renderizarArena();
    renderizarListas();
}

function proximoAlvo() {
    tentativasDigitadas[indiceAtual] = inputRespostaEl.value;
    indiceAtual = (indiceAtual + 1) % alvos.length;
    feedbackMsgEl.textContent = "";
    feedbackMsgEl.className = "feedback-msg";
    renderizarArena();
    renderizarListas();
}

function reiniciarJogo() {
    for (let i = 0; i < alvos.length; i++) {
        resolvidos[i] = false;
        tentativasDigitadas[i] = "";
    }
    indiceAtual = 0;

    combo = 0;
    feedbackMsgEl.textContent = "Sistema reiniciado! Todos os selos voltaram ao normal.";
    feedbackMsgEl.className = "feedback-msg";
    score = 0;
segundosDecorridos = 0;
timerDisplayEl.textContent = "00:00";
iniciarTimer();
    atualizarHud();
    renderizarArena();
    renderizarListas();
}

inputRespostaEl.addEventListener("input", (e) => {
    e.target.value = e.target.value
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z]/g, "");
    renderizarSlots(e.target.value, false);
});

inputRespostaEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        conferirAtaque();
    }
});



btnConferir.addEventListener("click", conferirAtaque);
btnProximo.addEventListener("click", proximoAlvo);
btnReiniciar.addEventListener("click", reiniciarJogo);
btnDica.addEventListener("click", usarScanner);
iniciarTimer();

atualizarHud();
renderizarArena();
renderizarListas();
