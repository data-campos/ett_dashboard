// src/models/Parceiro.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('controle_acesso_parceiros')
export class Parceiro {
  @PrimaryGeneratedColumn()
  id!: number; // usando o operador `!` para garantir ao TypeScript que o valor será atribuído pelo TypeORM

  @Column()
  nome_parceiro!: string; // `!` para sinalizar que TypeORM vai definir um valor para essa propriedade

  @Column()
  coligada_id!: number; // `!` para sinalizar que será inicializado pelo TypeORM

  @Column({ default: true })
  status_acesso: boolean = true; // inicializando com valor padrão
}
