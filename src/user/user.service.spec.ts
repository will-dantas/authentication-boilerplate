import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('UserService - unit tests', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be userservice defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash the password and create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'test'
    };

    const hashedPassword = 'hashedPassword';
    const createdUser = { 
      id: 1, 
      email: 'test@example.com', 
      password: hashedPassword, 
      name: 'test' 
    };

    const bcryptHash = jest.fn().mockResolvedValue(hashedPassword);
    (bcrypt.hash as jest.Mock) = bcryptHash;
    (prismaService.user.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await service.create(createUserDto);

    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: { ...createUserDto, password: hashedPassword },
    });
    expect(result).toEqual(createdUser);
  });

  it('should find a user by email', async () => {
    const email = 'test@example.com';
    const foundUser = { 
      id: 1, 
      email, 
      password: 'hashedPassword' 
    };

    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(foundUser);

    const result = await service.findByEmail(email);

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    expect(result).toEqual(foundUser);
  });
});
