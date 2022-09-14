import { Module } from '@nestjs/common';
import { ElasticModule } from '../elastic/elastic.module';
import { BenchesController } from './benches.controller';
import { BenchesService } from './benches.service';

@Module({
  imports: [ElasticModule],
  controllers: [BenchesController],
  providers: [BenchesService],
  exports: [BenchesService],
})
export class BenchesModule {}
