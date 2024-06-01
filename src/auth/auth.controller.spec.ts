import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRequest } from './models/AuthRequest';
import { Reflector } from '@nestjs/core';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController - unit tests', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn()
          }
        }
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return an access token with login', async () => {
    const req = {
      user: {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      },
    } as AuthRequest;

    const userToken = {
      access_token: 'jwtToken',
    };

    (authService.login as jest.Mock).mockReturnValue(userToken);

    const result = authController.login(req);

    expect(authService.login).toHaveBeenCalledWith(req.user);
    expect(result).toEqual(userToken);
  });
});
