import { Test, TestingModule } from '@nestjs/testing';
import { ViolationReportController } from './violation-report.controller';

describe('ViolationReportController', () => {
  let controller: ViolationReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViolationReportController],
    }).compile();

    controller = module.get<ViolationReportController>(ViolationReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
