// src/models/ControleAcessoParceiroGrupo.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GrupoEmpresarial } from './GrupoEmpresarial';

@Entity('controle_acesso_parceiro_grupo')
export class ControleAcessoParceiroGrupo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  grupo_empresarial_id!: number;

  @Column()
  parceiro_id!: number;

  @Column({ default: true })  // Certifique-se de que status_acesso está definido aqui
  status_acesso!: boolean;

  @ManyToOne(() => GrupoEmpresarial)
  @JoinColumn({ name: 'grupo_empresarial_id' })
  grupoEmpresarial!: GrupoEmpresarial;
}
