const botaoNovo = document.getElementById("botao-novo");
const dialogo = document.getElementById("dialogo");
const fecharDialogo = document.getElementById("fechar-dialogo");
const botaoCancelar = document.getElementById("botao-cancelar");
const botaoSalvar = document.getElementById("botao-salvar");
const tituloDialogo = document.getElementById("titulo-dialogo");
const inputNome = document.getElementById("input-nome");
const inputEmail = document.getElementById("input-email");
const listaUsuarios = document.getElementById("lista-usuarios");
const mensagemVazia = document.getElementById("mensagem-vazia");
const campoPesquisa = document.getElementById("campo-pesquisa");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let editandoId = null;

// === Atualiza lista de usuários ===
function atualizarLista(filtro = "") {

  listaUsuarios.innerHTML = "";

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  if (filtrados.length === 0) {
    mensagemVazia.classList.remove("oculto");
    return;
  }
  mensagemVazia.classList.add("oculto");

  filtrados.forEach((usuario, index) => {
    const div = document.createElement("div");
    div.classList.add("cartao");

    const nomeEl = document.createElement("h2");
    nomeEl.textContent = usuario.nome;

    const emailEl = document.createElement("p");
    emailEl.textContent = `✉ ${usuario.email}`;

    const botoes = document.createElement("div");
    botoes.classList.add("botoes");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("botao-editar");
    btnEditar.addEventListener("click", () => editarUsuario(index));

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("botao-excluir");
    btnExcluir.addEventListener("click", () => excluirUsuario(index));

    botoes.append(btnEditar, btnExcluir);
    div.append(nomeEl, emailEl, botoes);
    listaUsuarios.appendChild(div);
  });
}

// === Diálogo ===
function abrirDialogo(edicao = false) {

  dialogo.classList.remove("oculto");

  if (!edicao) {

    tituloDialogo.textContent = "Novo usuário";
    inputNome.value = "";
    inputEmail.value = "";
    editandoId = null;
  }
}

function fechar() {
  dialogo.classList.add("oculto");
}

function salvarUsuario() {

  const nome = inputNome.value.trim();
  const email = inputEmail.value.trim();

  if (!nome || !email) {
    return alert("Preencha todos os campos!");
  }

  if (editandoId !== null) {
    usuarios[editandoId] = {nome, email};
  }
  else {
    usuarios.push({nome, email});
  }

  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  atualizarLista();
  fechar();
}

function editarUsuario(index) {

  const usuario = usuarios[index];

  inputNome.value = usuario.nome;
  inputEmail.value = usuario.email;
  tituloDialogo.textContent = "Editar usuário";
  editandoId = index;

  abrirDialogo(true);
}

function excluirUsuario(index) {

  if (confirm ("Certeza que deseja excluir este usuário?")) {

    usuarios.splice(index, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    atualizarLista();
  }
}

// === Eventos ===
botaoNovo.addEventListener("click", () => abrirDialogo());
fecharDialogo.addEventListener("click", fechar);
botaoCancelar.addEventListener("click", fechar);
botaoSalvar.addEventListener("click", salvarUsuario);
campoPesquisa.addEventListener("input", e => atualizarLista(e.target.value));

// === Inicialização ===
atualizarLista();