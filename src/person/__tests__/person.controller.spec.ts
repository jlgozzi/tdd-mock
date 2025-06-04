import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from '../person.controller';
import { PersonService } from '../services/person.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '../entities/person.entity';
import { Repository } from 'typeorm';

describe('PersonController', () => {
  let controller: PersonController;

  const mockPersonRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockPersonRepository,
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
