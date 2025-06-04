import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from '../person.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../entities/person.entity';
import { Repository } from 'typeorm';

describe('PersonService', () => {
  let service: PersonService;
  let repo: Repository<Person>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    repo = module.get<Repository<Person>>(getRepositoryToken(Person));
  });

  it('should throw an error if CPF is invalid', async () => {
    const person = {
      name: 'Fulano',
      cpf: '123', // inválido
      birthDate: new Date('1990-01-01'),
      email: 'fulano@email.com',
    };

    await expect(service.create(person as any)).rejects.toThrowError(
      'CPF inválido',
    );
  });
});
