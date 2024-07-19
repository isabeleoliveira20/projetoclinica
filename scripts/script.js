document.addEventListener('DOMContentLoaded', function() {
    const cadastroCriancaForm = document.getElementById('cadastroCriancaForm');
    const cadastroDentistaForm = document.getElementById('cadastroDentistaForm');
    const mensagemErro = document.getElementById('mensagemErro');
    const confirmarAvatarButton = document.getElementById('confirmarAvatar');
    const avatarCanvas = document.getElementById('avatarCanvas');

    // Função para validar formulário
    function isFormValid(form) {
        const inputs = form.querySelectorAll('input[required]');
        for (let input of inputs) {
            if (!input.value.trim()) {
                return false;
            }
        }
        return true;
    }

    // Função para mostrar mensagem de erro
    function showError(message) {
        mensagemErro.textContent = message;
    }

    // Função para salvar dados no localStorage
    function saveData(key, formData) {
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Event listener para cadastro de criança
    if (cadastroCriancaForm) {
        cadastroCriancaForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (isFormValid(cadastroCriancaForm)) {
                saveData('crianca', new FormData(cadastroCriancaForm));
                window.location.href = 'espaco-infantil.html';
            } else {
                showError('Campos a serem preenchidos!');
            }
        });
    }

    // Event listener para cadastro de dentista
    if (cadastroDentistaForm) {
        cadastroDentistaForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (isFormValid(cadastroDentistaForm)) {
                saveData('dentista', new FormData(cadastroDentistaForm));
                window.location.href = 'espaco-dentista.html';
            } else {
                showError('Campos a serem preenchidos!');
            }
        });
    }

    // Funções para arrastar e soltar imagens
    if (avatarCanvas) {
        const options = document.querySelectorAll('.option img');
        options.forEach(option => {
            option.addEventListener('dragstart', handleDragStart);
        });

        avatarCanvas.addEventListener('dragover', handleDragOver);
        avatarCanvas.addEventListener('drop', handleDrop);
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const id = event.dataTransfer.getData('text/plain');
        const img = document.getElementById(id).cloneNode();
        img.style.position = 'absolute';
        img.style.left = `${event.clientX - avatarCanvas.offsetLeft}px`;
        img.style.top = `${event.clientY - avatarCanvas.offsetTop}px`;
        avatarCanvas.appendChild(img);
    }

    // Event listener para confirmar avatar
    if (confirmarAvatarButton) {
        confirmarAvatarButton.addEventListener('click', function() {
            const avatarParts = [];
            avatarCanvas.querySelectorAll('img').forEach(img => {
                avatarParts.push(img.id);
            });
            localStorage.setItem('avatar', JSON.stringify(avatarParts));
            window.location.href = 'em-atendimento.html';
        });
    }

    // Função para exibir ficha do paciente e do dentista
    function displayFicha() {
        const pacienteData = JSON.parse(localStorage.getItem('crianca'));
        const dentistaData = JSON.parse(localStorage.getItem('dentista'));

        if (pacienteData) {
            const fichaPaciente = document.getElementById('fichaPaciente');
            fichaPaciente.innerHTML = `
                <p>Nome: ${pacienteData.nomeCrianca}</p>
                <p>Data de Nascimento: ${pacienteData.dataNascimento}</p>
                <p>Nome do Responsável: ${pacienteData.nomeResponsavel}</p>
                <p>Email do Responsável: ${pacienteData.emailResponsavel}</p>
            `;
        }

        if (dentistaData) {
            const fichaDentista = document.getElementById('fichaDentista');
            fichaDentista.innerHTML = `
                <p>Nome: ${dentistaData.nomeDentista}</p>
                <p>Tempo de Atuação: ${dentistaData.tempoAtuacao}</p>
                <p>Email: ${dentistaData.emailDentista}</p>
            `;
        }
    }

    // Exibir fichas na página de atendimento
    if (document.getElementById('fichaPaciente') && document.getElementById('fichaDentista')) {
        displayFicha();
    }
});

