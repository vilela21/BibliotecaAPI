package com.example.bibliotecapi.repository;

import org.springframework.data.jpa.repository.JpaRepository; 
import org.springframework.stereotype.Repository; 

import com.example.bibliotecapi.model.LivroModel;

@Repository
public interface LivroRepository extends JpaRepository<LivroModel, Long> {
}