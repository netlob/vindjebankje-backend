import { Injectable } from '@nestjs/common';
import { ElasticService } from '../elastic/elastic.service';

@Injectable()
export class AdminService {
  constructor(private readonly elastic: ElasticService) {}
}
