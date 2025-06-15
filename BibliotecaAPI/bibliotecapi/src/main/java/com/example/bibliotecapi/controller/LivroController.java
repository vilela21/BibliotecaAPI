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

import com.example.bibliotecapi.model.LivroModel;
import com.example.bibliotecapi.service.LivroService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/livro")
public class LivroController {

    // Injeção de dependência do serviço de bibliotecário
    @Autowired
    private LivroService service;

    //ENDPOINTS
    @GetMapping
    public List<LivroModel> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivroModel> buscarPorId(@PathVariable Long id) {
        // - 200 OK com os dados se existir
        // - 404 Not Found se não existir
        return service.buscarPorId(id)
                      .map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public LivroModel salvar(@RequestBody LivroModel Livro) {
           // Recebe os dados do bibliotecário no corpo da requisição, dps banco
        return service.salvar(Livro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivroModel> atualizar(@PathVariable Long id, @RequestBody LivroModel Livro) {
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();// 404 se não existir
        }
        // Atualiza o ID do objeto
        Livro.setId(id);

        // Salva as alterações e retorna o objeto atualizado
        return ResponseEntity.ok(service.salvar(Livro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {

        
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();// 404 se não existir
        }

        // Chama o serviço para excluir o registro
        service.deletar(id);

        // Retorna 204 No Content (sucesso sem conteúdo)
        return ResponseEntity.noContent().build();
    }
}