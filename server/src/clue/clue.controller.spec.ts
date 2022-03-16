import { Test, TestingModule } from '@nestjs/testing';
import { ClueController } from './clue.controller';

describe('ClueController', () => {
  let controller: ClueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClueController],
    }).compile();

    controller = module.get<ClueController>(ClueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
