import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a JWT token', () => {
    const user: User = {
      id: 1,
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
    };

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const token = 'jwtToken';
    (jwtService.sign as jest.Mock).mockReturnValue(token);

    const result = authService.login(user);

    expect(jwtService.sign).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ access_token: token });
  });

  it('should return user data without password if validation succeeds', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const hashedPassword = 'hashedPassword';
    const user: User = {
      id: 1,
      email,
      password: hashedPassword,
      name: 'Test User',
    };

    (userService.findByEmail as jest.Mock).mockResolvedValue(user);
    const bcryptCompare = jest.fn().mockResolvedValue(true);

    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const result = await authService.validateUser(email, password);

    expect(userService.findByEmail).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toEqual({
      ...user,
      password: undefined,
    });
  });

  it('should throw an error if validation fails', async () => {
    const email = 'test@example.com';
    const password = 'password';

    (userService.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(authService.validateUser(email, password)).rejects.toThrow(
      'Email address or password is incorrect'
    );
  });

  it('should throw an error if password is incorrect', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const user: User = {
      id: 1,
      email,
      password: 'hashedPassword',
      name: 'Test User',
    };

    (userService.findByEmail as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.validateUser(email, password)).rejects.toThrow(
      'Email address or password is incorrect'
    );
  });
});
