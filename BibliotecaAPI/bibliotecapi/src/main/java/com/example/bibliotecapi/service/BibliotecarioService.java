package com.example.bibliotecapi.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.bibliotecapi.model.BibliotecarioModel;
import com.example.bibliotecapi.repository.BibliotecarioRepository;

@Service
public class BibliotecarioService {

    @Autowired
    private BibliotecarioRepository repository;

    public List<BibliotecarioModel> listarTodos() {
        return repository.findAll();
    }

    public Optional<BibliotecarioModel> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public BibliotecarioModel salvar(BibliotecarioModel bibliotecario) {
        return repository.save(bibliotecario);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}