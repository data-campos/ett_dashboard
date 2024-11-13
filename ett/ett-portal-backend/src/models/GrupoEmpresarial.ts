// src/models/GrupoEmpresarial.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ControleAcessoParceiroGrupo } from './ControleAcessoParceiroGrupo';

@Entity('grupo_empresarial')
export class GrupoEmpresarial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome_grupo!: string;

  @Column({ default: true })
  status_acesso!: boolean;

  @OneToMany(() => ControleAcessoParceiroGrupo, (parceiroGrupo) => parceiroGrupo.grupoEmpresarial)
  parceiros!: ControleAcessoParceiroGrupo[];
}
