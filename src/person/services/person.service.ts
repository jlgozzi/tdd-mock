import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Person } from '../entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  private isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0,
      resto;
    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  async create(data: Partial<Person>): Promise<Person> {
    if (!this.isValidCPF(data.cpf)) {
      throw new BadRequestException('CPF inválido');
    }

    const person = this.personRepository.create(data);
    try {
      return await this.personRepository.save(person);
    } catch (error) {
      if (error.code === '23505') {
        // Postgres unique violation
        if (error.detail && error.detail.includes('cpf')) {
          throw new BadRequestException(
            'Já existe uma pessoa cadastrada com este CPF',
          );
        }
        if (error.detail && error.detail.includes('email')) {
          throw new BadRequestException(
            'Já existe uma pessoa cadastrada com este e-mail',
          );
        }
        throw new BadRequestException('CPF ou e-mail já cadastrado');
      }
      throw new InternalServerErrorException(
        'Erro interno ao cadastrar pessoa',
      );
    }
  }

  async findAll(): Promise<Person[]> {
    return this.personRepository.find();
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({ where: { id } });

    if (!person) {
      throw new NotFoundException(`Pessoa com id ${id} não encontrada`);
    }

    return person;
  }

  async update(id: number, data: Partial<Person>): Promise<UpdateResult> {
    try {
      return await this.personRepository.update(id, data);
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail && error.detail.includes('cpf')) {
          throw new BadRequestException(
            'Já existe uma pessoa cadastrada com este CPF',
          );
        }
        if (error.detail && error.detail.includes('email')) {
          throw new BadRequestException(
            'Já existe uma pessoa cadastrada com este e-mail',
          );
        }
        throw new BadRequestException('CPF ou e-mail já cadastrado');
      }
      throw new InternalServerErrorException(
        'Erro interno ao atualizar pessoa',
      );
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.personRepository.delete(id);
  }
}
