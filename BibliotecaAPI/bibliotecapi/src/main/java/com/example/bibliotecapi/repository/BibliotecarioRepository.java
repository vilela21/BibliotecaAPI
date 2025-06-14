package com.example.bibliotecapi.repository;

import org.springframework.data.jpa.repository.JpaRepository; 
import org.springframework.stereotype.Repository; 

import com.example.bibliotecapi.model.BibliotecarioModel;

@Repository
public interface BibliotecarioRepository extends JpaRepository<BibliotecarioModel, Long> {
}