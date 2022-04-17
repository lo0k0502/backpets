import { Test, TestingModule } from '@nestjs/testing';
import { AdoptionRecordService } from './adoption-record.service';

describe('AdoptionRecordService', () => {
  let service: AdoptionRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdoptionRecordService],
    }).compile();

    service = module.get<AdoptionRecordService>(AdoptionRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
