// src/models/GrupoEmpresarial.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ControleAcessoParceiro } from './ControleAcessoParceiro';

@Entity('grupo_empresarial')
export class GrupoEmpresarial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ nullable: true })
  descricao?: string;

  @OneToMany(() => ControleAcessoParceiro, parceiro => parceiro.grupoEmpresarial)
  parceiros!: ControleAcessoParceiro[];
}
