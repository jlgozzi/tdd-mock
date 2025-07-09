import { Injectable, NotFoundException } from '@nestjs/common';
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
    return /^\d{11}$/.test(cpf.replace(/\D/g, ''));
  }

  async create(data: Partial<Person>): Promise<Person> {
    if (this.isValidCPF(data.cpf)) {
      throw new Error('CPF inválido');
    }

    const person = this.personRepository.create(data);
    return this.personRepository.save(person);
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
    return this.personRepository.update(id, data);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.personRepository.delete(id);
  }
}
