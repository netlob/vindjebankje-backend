import { Controller, Header, Post, Query } from '@nestjs/common';
import { BenchesService } from './benches.service';
import { BenchRangeQueryDto, BenchBoxQueryDto } from './dto/bench-query.dto';

@Controller('/benches')
export class BenchesController {
  constructor(private readonly benchesService: BenchesService) {}

  @Header('Cache-Control', 'public, max-age=86400')
  @Post('/query/range')
  async rangeQuery(@Query() query: BenchRangeQueryDto) {
    return await this.benchesService.rangeQuery(query);
  }

  @Header('Cache-Control', 'public, max-age=86400')
  @Post('/query/box')
  async boxQuery(@Query() query: BenchBoxQueryDto) {
    return await this.benchesService.boxQuery(query);
  }
}
