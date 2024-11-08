import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { VerificationCode } from './models/VerificationCode';
import { Empresa } from './models/Empresa';
import { Usuario } from './models/Usuario';
import { PermissaoDashboard } from './models/PermissaoDashboard';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3308,
  username: 'dtc_saga',
  password: '179856',
  database: 'db_st_ettfirst',
  entities: [VerificationCode, Empresa, Usuario, PermissaoDashboard],
  synchronize: true,
});
