// livro.js

const API_URL = 'http://localhost:8080/api/livro';
const BIBLIOTECARIO_API_URL = 'http://localhost:8080/api/bibliotecario';

// Elementos do DOM
const form = document.getElementById('imageForm');
const tabelaLivro = document.getElementById('tabelaLivro');
const bibliotecarioSelect = document.getElementById('bibliotecarioSelect');

// Função para carregar bibliotecários
async function carregarBibliotecarios() {
    try {
        const response = await fetch(BIBLIOTECARIO_API_URL);
        if (!response.ok) {
            throw new Error('Erro ao carregar bibliotecários');
        }
        
        return await response.json();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
        return [];
    }
}

// Preencher dropdown de bibliotecários
async function preencherDropdownBibliotecarios() {
    const bibliotecarios = await carregarBibliotecarios();
    
    bibliotecarioSelect.innerHTML = '<option value="">Nenhum (livro disponível)</option>';
    
    bibliotecarios.forEach(b => {
        const option = document.createElement('option');
        option.value = b.id;
        option.textContent = `${b.nome} (ID: ${b.id})`;
        bibliotecarioSelect.appendChild(option);
    });
}

// Função para carregar livros
async function carregarLivros() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro ao carregar livros');
        }
        
        const livros = await response.json();
        exibirLivros(livros);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Função para exibir livros na tabela
function exibirLivros(livros) {
    tabelaLivro.innerHTML = '';
    
    livros.forEach(livro => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td class="px-4 py-2 border">${livro.id}</td>
            <td class="px-4 py-2 border">${livro.titulo}</td>
            <td class="px-4 py-2 border">${livro.autor}</td>
            <td class="px-4 py-2 border">${livro.genero}</td>
            <td class="px-4 py-2 border">${livro.status}</td>
            <td class="px-4 py-2 border">${livro.dataCadastro}</td>
            <td class="px-4 py-2 border">${livro.bibliotecario ? livro.bibliotecario.id : 'N/A'}</td>
            <td class="px-4 py-2 border">
                <button onclick="editarLivro(${livro.id})" 
                        class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                    Editar
                </button>
            </td>
            <td class="px-4 py-2 border">
                <button onclick="excluirLivro(${livro.id})" 
                        class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    Excluir
                </button>
            </td>
        `;
        
        tabelaLivro.appendChild(tr);
    });
}

// Função para adicionar livro
//  async Pode esperar operações demoradas (como API)
// await serve para pausar a execução de uma função async e aguardar a conclusão de uma operação
async function adicionarLivro(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const genero = document.getElementById('genero').value;
    const status = document.getElementById('status').value;
    const dataCadastro = document.getElementById('dataCadastro').value;
    const bibliotecarioId = bibliotecarioSelect.value;
    
    if (!titulo || !autor || !genero || !status) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Por favor, preencha todos os campos obrigatórios!'
        });
        return;
    }
    
    try {
        const livro = {
            titulo,
            autor,
            genero,
            status,
            dataCadastro: dataCadastro || null,
            bibliotecario: bibliotecarioId ? { id: parseInt(bibliotecarioId) } : null
        };
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao adicionar livro');
        }
        
        // Limpa o formulário
        form.reset();
        bibliotecarioSelect.value = '';
        
        // Recarrega a tabela
        carregarLivros();
        
        // Exibe mensagem de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Livro adicionado com sucesso'
        });
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Função para editar livro
async function editarLivro(id) {
    try {
        // Busca os dados do livro
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do livro');
        }
        
        const livro = await response.json();
        
        // Preenche o formulário com os dados
        document.getElementById('titulo').value = livro.titulo;
        document.getElementById('autor').value = livro.autor;
        document.getElementById('genero').value = livro.genero;
        document.getElementById('status').value = livro.status;
        document.getElementById('dataCadastro').value = livro.dataCadastro;
        
        // Preenche o campo do bibliotecário
        if (livro.bibliotecario) {
            bibliotecarioSelect.value = livro.bibliotecario.id;
        } else {
            bibliotecarioSelect.value = '';
        }
        
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
            await atualizarLivro(id);
        };
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Função para atualizar livro
async function atualizarLivro(id) {
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const genero = document.getElementById('genero').value;
    const status = document.getElementById('status').value;
    const dataCadastro = document.getElementById('dataCadastro').value;
    const bibliotecarioId = bibliotecarioSelect.value;
    
    if (!titulo || !autor || !genero || !status) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Por favor, preencha todos os campos obrigatórios!'
        });
        return;
    }
    
    try {
        const livro = {
            titulo,
            autor,
            genero,
            status,
            dataCadastro: dataCadastro || null,
            bibliotecario: bibliotecarioId ? { id: parseInt(bibliotecarioId) } : null
        };
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar livro');
        }
        
        // Limpa o formulário
        form.reset();
        bibliotecarioSelect.value = '';
        
        // Restaura o botão para "Adicionar"
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Adicionar';
        submitButton.classList.remove('bg-green-500', 'hover:bg-green-600');
        submitButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
        
        // Restaura o event listener original
        form.onsubmit = adicionarLivro;
        
        // Recarrega a tabela
        carregarLivros();
        
        // Exibe mensagem de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Livro atualizado com sucesso'
        });
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
}

// Função para excluir livro
async function excluirLivro(id) {
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
                throw new Error('Erro ao excluir livro');
            }
            
            // Recarrega a tabela
            carregarLivros();
            
            Swal.fire(
                'Excluído!',
                'O livro foi excluído.',
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
document.addEventListener('DOMContentLoaded', async () => {
    // Carrega os bibliotecários para o dropdown
    await preencherDropdownBibliotecarios();
    
    // Carrega os livros ao iniciar
    carregarLivros();
    
    // Configura o evento de submit do formulário
    form.onsubmit = adicionarLivro;
});
