-- SQLBook: Code
CREATE DATABASE biblioteca;

CREATE TABLE IF NOT EXISTS `biblioteca`.`bibliotecario` (
  `id` INT NOT NULL,
  `nome` VARCHAR(255) NULL,
  `email` VARCHAR(55) NULL,
  PRIMARY KEY (`id`));

DROP TABLE IF EXISTS `biblioteca`.`livros` ;

CREATE TABLE IF NOT EXISTS `biblioteca`.`livros` (
  `id` INT NOT NULL,
  `titulo` VARCHAR(255) NULL,
  `autor` VARCHAR(255) NULL,
  `genero` VARCHAR(45) NULL,
  `status` VARCHAR(45) NULL,
  `dataCadastro` DATE NULL,
  `bibliotecario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_livros_bibliotecario1`
    FOREIGN KEY (`bibliotecario_id`)
    REFERENCES `biblioteca`.`bibliotecario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)