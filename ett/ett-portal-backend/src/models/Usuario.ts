import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Empresa } from './Empresa';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  email!: string;

  @Column()
  telefone!: string;

  @Column()
  senha_hash!: string;

  @Column({ default: false })
  super_usuario!: boolean;

  @Column({ nullable: true, type: 'datetime' })
  sessionExpiration?: Date | null;

  @ManyToOne(() => Empresa, empresa => empresa.usuarios)
  empresa!: Empresa;
}
