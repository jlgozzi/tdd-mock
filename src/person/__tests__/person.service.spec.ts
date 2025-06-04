import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from '../services/person.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../entities/person.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

describe('PersonService', () => {
  let service: PersonService;
  let repo: jest.Mocked<Repository<Person>>;
  const logger = new Logger('PersonServiceTest');

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    repo = module.get(getRepositoryToken(Person));
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should throw an error if CPF is invalid', async () => {
      logger.log('➡️ Testando criação com CPF inválido');

      const invalidPerson = {
        name: 'John Doe',
        cpf: '123',
        birthDate: new Date('1990-01-01'),
        email: 'john@email.com',
      };

      await expect(service.create(invalidPerson as any)).rejects.toThrow(
        'CPF inválido',
      );
    });

    it('should create and return a valid person', async () => {
      const validPerson = {
        name: 'John Silva',
        cpf: '12345678901',
        birthDate: new Date('1990-01-01'),
        email: 'joao@email.com',
      };

      const created = { ...validPerson, id: 1 };

      repo.create.mockReturnValue(validPerson as Person);
      repo.save.mockResolvedValue(created as Person);

      const result = await service.create(validPerson);
      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith(validPerson);
      expect(repo.save).toHaveBeenCalledWith(validPerson);
    });
  });

  describe('findAll()', () => {
    it('should return a list of persons', async () => {
      const persons = [
        {
          id: 1,
          name: 'John',
          cpf: '12345678901',
          email: 'a@a.com',
          birthDate: new Date(),
        },
        {
          id: 2,
          name: 'Charlie',
          cpf: '10987654321',
          email: 'b@b.com',
          birthDate: new Date(),
        },
      ];

      repo.find.mockResolvedValue(persons as Person[]);

      const result = await service.findAll();
      expect(result).toEqual(persons);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a person by id', async () => {
      const person = {
        id: 1,
        name: 'Fulano',
        cpf: '12345678901',
        birthDate: new Date(),
        email: 'f@f.com',
      };
      repo.findOne.mockResolvedValue(person as Person);

      const result = await service.findOne(1);
      expect(result).toEqual(person);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update()', () => {
    it('should update a person by id', async () => {
      const updateResult = { affected: 1 };
      repo.update.mockResolvedValue(updateResult as any);

      const result = await service.update(1, { name: 'Novo Nome' });
      expect(result).toEqual(updateResult);
      expect(repo.update).toHaveBeenCalledWith(1, { name: 'Novo Nome' });
    });
  });

  describe('remove()', () => {
    it('should delete a person by id', async () => {
      const deleteResult = { affected: 1 };
      repo.delete.mockResolvedValue(deleteResult as any);

      const result = await service.remove(1);
      expect(result).toEqual(deleteResult);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });
});
