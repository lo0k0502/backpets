import { Test, TestingModule } from '@nestjs/testing';
import { ViolationReportService } from './violation-report.service';

describe('ViolationReportService', () => {
  let service: ViolationReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViolationReportService],
    }).compile();

    service = module.get<ViolationReportService>(ViolationReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
