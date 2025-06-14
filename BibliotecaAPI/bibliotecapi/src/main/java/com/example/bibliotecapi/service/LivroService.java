package com.example.bibliotecapi.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.bibliotecapi.model.LivroModel;
import com.example.bibliotecapi.repository.LivroRepository;

@Service
public class LivroService {

    @Autowired
    private LivroRepository repository;

    public List<LivroModel> listarTodos() {
        return repository.findAll();
    }

    public Optional<LivroModel> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public LivroModel salvar(LivroModel livro) {
        return repository.save(livro);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}