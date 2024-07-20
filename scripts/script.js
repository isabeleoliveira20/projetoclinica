document.addEventListener('DOMContentLoaded', function() {
    const cadastroCriancaForm = document.getElementById('cadastroCriancaForm');
    const loginForm = document.getElementById('loginForm');
    const mensagemErroCadastro = document.getElementById('mensagemErroCadastro');
    const mensagemErroLogin = document.getElementById('mensagemErroLogin');
    const confirmarAvatarButton = document.getElementById('confirmarAvatar');
    const confirmarEmocaoButton = document.getElementById('confirmarEmocao');
    const avatarCanvas = document.getElementById('avatarCanvas');
    let consultaIndex = 1;

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
    function showError(element, message) {
        element.textContent = message;
    }

    // Função para salvar dados no localStorage
    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Função para carregar dados do localStorage
    function loadData(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    // Event listener para cadastro de criança
    if (cadastroCriancaForm) {
        cadastroCriancaForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (isFormValid(cadastroCriancaForm)) {
                const formData = new FormData(cadastroCriancaForm);
                const data = Object.fromEntries(formData.entries());
                saveData('crianca', data);
                window.location.href = '#login';
            } else {
                showError(mensagemErroCadastro, 'Campos a serem preenchidos!');
            }
        });
    }

    // Event listener para login
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('loginUsuario').value.trim();
            const password = document.getElementById('loginSenha').value.trim();

            const storedCrianca = loadData('crianca');

            if (username === 'odontopediatra' && password === 'dentista123') {
                window.location.href = 'espaco-dentista.html';
            } else if (storedCrianca && username === storedCrianca.nomeCrianca && password === storedCrianca.senhaCrianca) {
                window.location.href = 'espaco-infantil.html';
            } else {
                showError(mensagemErroLogin, 'Usuário ou senha incorretos!');
            }
        });
    }

    // Funções para clicar e posicionar imagens
    if (avatarCanvas && confirmarAvatarButton) {
        const options = document.querySelectorAll('.option img');
        options.forEach(option => {
            option.addEventListener('click', handleImageClick);
        });
    }

    function handleImageClick(event) {
        const id = event.target.id;
        const img = document.getElementById(id).cloneNode(true);
        img.style.width = '100px'; // Ajuste o tamanho conforme necessário
        img.style.height = 'auto'; // Manter a proporção
        img.style.position = 'absolute';

        // Posicionar imagens em locais específicos dependendo da parte do corpo
        switch (event.target.dataset.part) {
            case 'pele':
                img.style.left = '50px';
                img.style.top = '50px';
                break;
            case 'cabelo':
                img.style.left = '50px';
                img.style.top = '0px';
                break;
            case 'roupa':
                img.style.left = '50px';
                img.style.top = '150px';
                break;
            case 'emocao':
                img.style.left = '150px';
                img.style.top = '100px';
                break;
        }

        avatarCanvas.appendChild(img);
    }

    // Event listener para confirmar avatar
    if (confirmarAvatarButton) {
        confirmarAvatarButton.addEventListener('click', function() {
            const avatarParts = [];
            avatarCanvas.querySelectorAll('img').forEach(img => {
                avatarParts.push(img.id);
            });
            const storedCrianca = loadData('crianca') || {};
            const consulta = {
                preAtendimento: avatarParts.find(part => part.includes('emocao')),
                postAtendimento: null,
            };
            storedCrianca.consultas = storedCrianca.consultas || [];
            storedCrianca.consultas.push(consulta);
            saveData('crianca', storedCrianca);
            window.location.href = 'em-atendimento.html';
        });
    }

    // Carregar o avatar e permitir alteração da emoção na segunda página
    if (confirmarEmocaoButton) {
        const storedCrianca = loadData('crianca');
        if (storedCrianca && storedCrianca.consultas.length > 0) {
            const lastConsulta = storedCrianca.consultas[storedCrianca.consultas.length - 1];
            if (lastConsulta.preAtendimento) {
                const img = document.createElement('img');
                img.src = `./imagens/${lastConsulta.preAtendimento}.png`;
                img.style.width = '100px';
                img.style.height = 'auto';
                img.style.position = 'absolute';
                img.style.left = '150px';
                img.style.top = '100px';
                avatarCanvas.appendChild(img);
            }
        }

        const options = document.querySelectorAll('.option img');
        options.forEach(option => {
            option.addEventListener('click', function(event) {
                avatarCanvas.querySelectorAll('img').forEach(img => {
                    if (img.dataset.part === 'emocao') {
                        avatarCanvas.removeChild(img);
                    }
                });
                handleImageClick(event);
            });
        });

        confirmarEmocaoButton.addEventListener('click', function() {
            const newEmotion = avatarCanvas.querySelector('img[data-part="emocao"]').id;
            storedCrianca.consultas[storedCrianca.consultas.length - 1].postAtendimento = newEmotion;
            saveData('crianca', storedCrianca);
            window.location.href = 'espaco-dentista.html';
        });
    }

    // Função para exibir relatório no Espaço do Dentista
    function exibirRelatorio() {
        const storedCrianca = loadData('crianca');
        if (storedCrianca) {
            const relatorioDiv = document.getElementById('relatorio');
            const dentistaNome = 'Dr. Sônia';
            let relatorioHTML = `
                <p>Nome: ${storedCrianca.nomeCrianca}, Idade: ${storedCrianca.idadeCrianca}</p>
                <p>Dentista: ${dentistaNome}</p>
                <h3>Consultas</h3>
            `;

            storedCrianca.consultas.forEach((consulta, index) => {
                relatorioHTML += `
                    <p>Consulta ${index + 1}</p>
                    <p>Pré-atendimento: ${consulta.preAtendimento}</p>
                    <p>Pós-atendimento: ${consulta.postAtendimento || 'Ainda não registrado'}</p>
                `;
            });

            relatorioDiv.innerHTML = relatorioHTML;
        }
    }

    // Exibir relatório na página do Espaço do Dentista
    if (document.getElementById('relatorio')) {
        exibirRelatorio();
    }
});
