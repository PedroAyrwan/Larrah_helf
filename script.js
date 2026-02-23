// Funções para abrir e fechar o Modal
function openModal() {
    const modal = document.getElementById('modalGarantir');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Trava a rolagem da página ao fundo
}

function closeModal() {
    const modal = document.getElementById('modalGarantir');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto'; // Restaura a rolagem da página

    // Aguarda a animação de fechar o modal e reseta o formulário para o estado inicial
    setTimeout(() => {
        document.getElementById('mensagemSucesso').classList.add('hidden');
        document.getElementById('mensagemSucesso').classList.remove('flex');
        document.getElementById('conteudoFormulario').classList.remove('hidden');
        document.getElementById('conteudoFormulario').classList.add('block');
    }, 400);
}

// Máscara para o campo de WhatsApp
const inputWhatsapp = document.getElementById('whatsapp');
if (inputWhatsapp) {
    inputWhatsapp.addEventListener('input', function (e) {
        // Remove tudo que não é dígito
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        // Formata como (99) 99999-9999
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}

// Manipulação e Envio do Formulário
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formGarantir');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('btnEnviar');
            const textoBotao = document.getElementById('textoBotao');
            const spinnerBotao = document.getElementById('spinnerBotao');
            
            // Empacota os dados para envio
            const dadosFormulario = new URLSearchParams();
            dadosFormulario.append('nome', document.getElementById('nome').value);
            dadosFormulario.append('email', document.getElementById('email').value);
            dadosFormulario.append('whatsapp', document.getElementById('whatsapp').value);
            dadosFormulario.append('origem', 'Landing Page - Larah Helf');

            // Feedback visual no botão: Desabilita, muda texto e mostra o spinner
            btn.disabled = true;
            if (textoBotao) textoBotao.textContent = 'Enviando...';
            if (spinnerBotao) spinnerBotao.classList.remove('hidden');

            try {
                // Sua URL do Google Apps Script
                const URL_WEBHOOK = 'https://script.google.com/macros/s/AKfycbzqUs2PHOjq7MS_QNxstFYHXsycqv6GAnX5J5AqICOQIIIH5RuQD1XD91U5IEOaYhJePw/exec'; 

                await fetch(URL_WEBHOOK, {
                    method: 'POST',
                    body: dadosFormulario,
                    mode: 'no-cors' // Impede que o navegador bloqueie a requisição por política de segurança (CORS)
                });

                // Sucesso visual: Esconde o formulário e mostra a mensagem chique (removemos o alert)
                document.getElementById('conteudoFormulario').classList.remove('block');
                document.getElementById('conteudoFormulario').classList.add('hidden');
                
                document.getElementById('mensagemSucesso').classList.remove('hidden');
                document.getElementById('mensagemSucesso').classList.add('flex');
                
                form.reset();
                
            } catch (error) {
                console.error('Erro ao enviar:', error);
                alert('Houve um erro de comunicação. Por favor, tente novamente.');
            } finally {
                // Restaura o botão ao estado original
                btn.disabled = false;
                if (textoBotao) textoBotao.textContent = 'Enviar e Reservar';
                if (spinnerBotao) spinnerBotao.classList.add('hidden');
            }
        });
    }
});