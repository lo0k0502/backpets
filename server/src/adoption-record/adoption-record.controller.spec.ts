import { Test, TestingModule } from '@nestjs/testing';
import { AdoptionRecordController } from './adoption-record.controller';

describe('AdoptionRecordController', () => {
  let controller: AdoptionRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdoptionRecordController],
    }).compile();

    controller = module.get<AdoptionRecordController>(AdoptionRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
