package com.example.bibliotecapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bibliotecapi.model.BibliotecarioModel;
import com.example.bibliotecapi.service.BibliotecarioService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/bibliotecario")
public class BibliotecarioController {

    @Autowired
    private BibliotecarioService service;

    @GetMapping
    public List<BibliotecarioModel> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BibliotecarioModel> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                      .map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BibliotecarioModel salvar(@RequestBody BibliotecarioModel bibliotecario) {
        return service.salvar(bibliotecario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BibliotecarioModel> atualizar(@PathVariable Long id, @RequestBody BibliotecarioModel bibliotecario) {
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        bibliotecario.setId(id);
        return ResponseEntity.ok(service.salvar(bibliotecario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}