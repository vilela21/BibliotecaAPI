// bibliotecario.js

// URL base da API
const API_URL = 'http://localhost:8080/api/bibliotecario';

// Elementos do DOM
const form = document.getElementById('imageForm');
const tabelaBibliotecario = document.getElementById('tabelaBibliotecario');

// Função para carregar bibliotecários
async function carregarBibliotecarios() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro ao carregar bibliotecários');
        }
        
        const bibliotecarios = await response.json();
        exibirBibliotecarios(bibliotecarios);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Função para exibir bibliotecários na tabela
function exibirBibliotecarios(bibliotecarios) {
    tabelaBibliotecario.innerHTML = '';
    
    bibliotecarios.forEach(bibliotecario => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td class="px-4 py-2 border">${bibliotecario.id}</td>
            <td class="px-4 py-2 border">${bibliotecario.nome}</td>
            <td class="px-4 py-2 border">${bibliotecario.email}</td>
            <td class="px-4 py-2 border">
                <button onclick="editarBibliotecario(${bibliotecario.id})" 
                        class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                    Editar
                </button>
            </td>
            <td class="px-4 py-2 border">
                <button onclick="excluirBibliotecario(${bibliotecario.id})" 
                        class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    Excluir
                </button>
            </td>
        `;
        
        tabelaBibliotecario.appendChild(tr);
    });
}

// Função para adicionar bibliotecário
async function adicionarBibliotecario(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    
    if (!nome || !email) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Por favor, preencha todos os campos!'
        });
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao adicionar bibliotecário');
        }
        
        // Limpa o formulário
        form.reset();
        
        // Recarrega a tabela
        carregarBibliotecarios();
        
        // Exibe mensagem de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Bibliotecário adicionado com sucesso'
        });
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Função para editar bibliotecário
async function editarBibliotecario(id) {
    try {
        // Busca os dados do bibliotecário
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do bibliotecário');
        }
        
        const bibliotecario = await response.json();
        
        // Preenche o formulário com os dados
        document.getElementById('nome').value = bibliotecario.nome;
        document.getElementById('email').value = bibliotecario.email;
        
        // Altera o botão para "Atualizar"
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Atualizar';
        submitButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        submitButton.classList.add('bg-green-500', 'hover:bg-green-600');
        
        // Remove o event listener anterior para evitar duplicação
        form.onsubmit = null;
        
        // Adiciona novo event listener para atualização
        form.onsubmit = async (e) => {
            e.preventDefault();
            await atualizarBibliotecario(id);
        };
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Função para atualizar bibliotecário
async function atualizarBibliotecario(id) {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    
    if (!nome || !email) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Por favor, preencha todos os campos!'
        });
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar bibliotecário');
        }
        
        // Limpa o formulário
        form.reset();
        
        // Restaura o botão para "Adicionar"
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Adicionar';
        submitButton.classList.remove('bg-green-500', 'hover:bg-green-600');
        submitButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
        
        // Restaura o event listener original
        form.onsubmit = adicionarBibliotecario;
        
        // Recarrega a tabela
        carregarBibliotecarios();
        
        // Exibe mensagem de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Bibliotecário atualizado com sucesso'
        });
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Função para excluir bibliotecário
async function excluirBibliotecario(id) {
    try {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });
        
        if (result.isConfirmed) {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Erro ao excluir bibliotecário');
            }
            
            // Recarrega a tabela
            carregarBibliotecarios();
            
            Swal.fire(
                'Excluído!',
                'O bibliotecário foi excluído.',
                'success'
            );
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carrega os bibliotecários ao iniciar
    carregarBibliotecarios();
    
    // Configura o evento de submit do formulário
    form.onsubmit = adicionarBibliotecario;
});