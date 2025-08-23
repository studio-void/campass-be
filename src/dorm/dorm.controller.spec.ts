import { Test, TestingModule } from '@nestjs/testing';
import { DormController } from './dorm.controller';

describe('DormController', () => {
  let controller: DormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DormController],
    }).compile();

    controller = module.get<DormController>(DormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
