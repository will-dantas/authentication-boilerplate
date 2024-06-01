import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController - unit tests', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call userService.create with the correct parameters', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'test'
    };

    const createdUser = { 
      id: 1, 
      email: 'test@example.com', 
      password: 'hashedPassword',
      name: test
    };

    (userService.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await controller.create(createUserDto);

    expect(userService.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(createdUser);
  });
});
