import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { INestApplication } from '@nestjs/common';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    app = { close: jest.fn() } as any as INestApplication;
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should call connect with onModuleInit', async () => {
    prismaService.$connect = jest.fn();
    await prismaService.onModuleInit();
    expect(prismaService.$connect).toHaveBeenCalled();
  });

  it('should register a beforeExit hook that calls with enableShutdownHooks', () => {
    const processOnSpy = jest.spyOn(process, 'on');

    prismaService.enableShutdownHooks(app);
    expect(processOnSpy).toHaveBeenCalledWith('beforeExit', expect.any(Function));

    const beforeExitCallback = processOnSpy.mock.calls[0][1];
    beforeExitCallback();
    expect(app.close).toHaveBeenCalled();
  });
});
