import { Test, TestingModule } from '@nestjs/testing';
import { ClueService } from './clue.service';

describe('ClueService', () => {
  let service: ClueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClueService],
    }).compile();

    service = module.get<ClueService>(ClueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
