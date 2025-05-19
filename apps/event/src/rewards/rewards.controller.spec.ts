import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { ForbiddenException } from '@nestjs/common';

describe('RewardsController', () => {
  let controller: RewardsController;
  let service: RewardsService;

  const mockService = {
    create: jest.fn().mockImplementation((dto) => ({ ...dto, _id: '1' })),
    findAll: jest.fn().mockResolvedValue(['reward1', 'reward2']),
    findManyByName: jest.fn().mockResolvedValue(['reward1']),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [{ provide: RewardsService, useValue: mockService }],
    }).compile();

    controller = module.get<RewardsController>(RewardsController);
    service = module.get<RewardsService>(RewardsService);
  });

  describe('create', () => {
    it('should allow ADMIN to create reward', async () => {
      const result = await controller.create(
        { name: '보상A', quantity: 10, eventName: '출석이벤트' },
        { user: { role: 'ADMIN' } } as any,
      );
      expect(result).toHaveProperty('_id');
      expect(service.create).toHaveBeenCalled();
    });

    it('should deny USER role from creating reward', async () => {
      await expect(
        controller.create(
          { name: '보상A', quantity: 10, eventName: '출석이벤트' },
          { user: { role: 'USER' } } as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should allow ADMIN to get all rewards', async () => {
      const result = await controller.findAll({
        user: { role: 'ADMIN' },
      } as any);
      expect(result).toEqual(['reward1', 'reward2']);
    });

    it('should deny USER from accessing reward list', async () => {
      await expect(
        controller.findAll({ user: { role: 'USER' } } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findManyByName', () => {
    it('should allow AUDITOR to search reward by name', async () => {
      const result = await controller.findManyByName('보상', {
        user: { role: 'AUDITOR' },
      } as any);
      expect(result).toEqual(['reward1']);
    });

    it('should deny USER from searching reward by name', async () => {
      await expect(
        controller.findManyByName('보상', { user: { role: 'USER' } } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
