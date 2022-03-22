import { Test, TestingModule } from '@nestjs/testing';
import { PutUpForAdoptionService } from './put-up-for-adoption.service';

describe('PutUpForAdoptionService', () => {
  let service: PutUpForAdoptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PutUpForAdoptionService],
    }).compile();

    service = module.get<PutUpForAdoptionService>(PutUpForAdoptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
