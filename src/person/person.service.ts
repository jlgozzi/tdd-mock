import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(data: Partial<Person>) {
    if (!this.isValidCPF(data.cpf)) {
      throw new Error('CPF inválido');
    }

    const person = this.personRepository.create(data);
    return this.personRepository.save(person);
  }

  private isValidCPF(cpf: string): boolean {
    // Aqui pode ser uma validação simples por enquanto (tamanho, dígitos)
    return /^\d{11}$/.test(cpf.replace(/\D/g, ''));
  }
}
