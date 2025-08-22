import { Test, TestingModule } from '@nestjs/testing';
import { DormService } from './dorm.service';

describe('DormService', () => {
  let service: DormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DormService],
    }).compile();

    service = module.get<DormService>(DormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
