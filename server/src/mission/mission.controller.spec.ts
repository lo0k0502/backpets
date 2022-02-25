import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from '../mission/mission.controller';

describe('MissionController', () => {
  let controller: MissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionController],
    }).compile();

    controller = module.get<MissionController>(MissionController);
  });

  it.only('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
