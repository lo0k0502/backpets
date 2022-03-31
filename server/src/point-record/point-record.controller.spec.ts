import { Test, TestingModule } from '@nestjs/testing';
import { PointRecordController } from './point-record.controller';

describe('PointRecordController', () => {
  let controller: PointRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointRecordController],
    }).compile();

    controller = module.get<PointRecordController>(PointRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
