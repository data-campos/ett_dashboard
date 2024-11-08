import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendSms } from '../utils/smsService';
import { VerificationCode } from '../models/VerificationCode';
import { Usuario } from '../models/Usuario';
import { AppDataSource } from '../data-source';

// Função para gerar data de expiração (30 dias a partir de agora)
const generateSessionExpiration = () => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  return expirationDate;
};

export const requestCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("Dados recebidos na requisição:", req.body);
  try {
    const { email, phone } = req.body;

    // Validar entrada
    if (!email || !phone) {
      res.status(400).json({ message: 'Email e telefone são obrigatórios' });
      return;
    }

    // Verificar se o usuário existe no banco de dados
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOneBy({ email, telefone: phone });

    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Gerar código de verificação
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Salvar o código no banco de dados com timestamp
    const codeEntry = new VerificationCode();
    codeEntry.email = email;
    codeEntry.phone = phone;
    codeEntry.code = verificationCode.toString();

    await AppDataSource.manager.save(codeEntry);

    // Enviar código via SMS usando o Comtele
    await sendSms(phone, `Seu código de verificação é: ${verificationCode}`);
    
    res.status(200).json({ message: 'Código de verificação enviado' });
  } catch (error) {
    next(error);
  }
};

export const verifyCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, code, rememberLogin } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: 'Email e código são obrigatórios' });
      return;
    }

    const repository = AppDataSource.getRepository(VerificationCode);
    const verificationEntry = await repository.findOneBy({ email, code });

    if (!verificationEntry) {
      res.status(400).json({ message: 'Código inválido ou expirado' });
      return;
    }

    // Remover o código após uso
    await repository.delete(verificationEntry.id);

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOneBy({ email });

    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Atualizar data de expiração da sessão
    usuario.sessionExpiration = rememberLogin ? generateSessionExpiration() : null;
    await usuarioRepository.save(usuario);

    // Verificação adicional para garantir que empresa existe antes de acessar empresa.id
    const empresaId = usuario.empresa ? usuario.empresa.id : null;

    // Gerar token JWT com informações de superusuário e empresa
    const token = jwt.sign(
      {
        userId: usuario.id,
        empresaId, // Usa o ID da empresa ou null se empresa for indefinida
        super_usuario: usuario.super_usuario,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao verificar o código:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
