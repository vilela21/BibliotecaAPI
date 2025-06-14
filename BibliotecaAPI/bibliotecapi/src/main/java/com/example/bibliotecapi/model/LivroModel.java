package com.example.bibliotecapi.model;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "livros") 
@Getter
@Setter
@NoArgsConstructor
public class LivroModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(nullable = false, length = 255)
    private String autor;

    @Column(nullable = false, length = 45)
    private String genero;

    @Column(nullable = false, length = 45)
    private String status;

    @Column(name = "dataCadastro", nullable = false)
    private LocalDate dataCadastro = LocalDate.now(); 

    @ManyToOne
    @JoinColumn(name = "bibliotecario_id", referencedColumnName = "id")
    private BibliotecarioModel bibliotecario;
}