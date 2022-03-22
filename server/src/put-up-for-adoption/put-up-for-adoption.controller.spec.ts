import { Test, TestingModule } from '@nestjs/testing';
import { PutUpForAdoptionController } from './put-up-for-adoption.controller';

describe('PutUpForAdoptionController', () => {
  let controller: PutUpForAdoptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PutUpForAdoptionController],
    }).compile();

    controller = module.get<PutUpForAdoptionController>(PutUpForAdoptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
