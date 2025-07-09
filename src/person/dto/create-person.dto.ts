import { IsString, IsEmail, IsDateString, Length } from 'class-validator';

export class CreatePersonDto {
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @IsString({ message: 'CPF deve ser uma string' })
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos' })
  cpf: string;

  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  birthDate: Date;

  @IsEmail({}, { message: 'E-mail deve ser válido' })
  email: string;
}
