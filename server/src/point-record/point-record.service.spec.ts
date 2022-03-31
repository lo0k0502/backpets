import { Test, TestingModule } from '@nestjs/testing';
import { PointRecordService } from './point-record.service';

describe('PointRecordService', () => {
  let service: PointRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointRecordService],
    }).compile();

    service = module.get<PointRecordService>(PointRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
