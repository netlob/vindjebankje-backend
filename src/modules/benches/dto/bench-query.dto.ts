import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { toNumber } from '../../../utils/cast';

export class BenchRangeQueryDto {
  @Transform(({ value }) => toNumber(value, { required: true }))
  @IsNumber()
  public lat: number;

  @Transform(({ value }) => toNumber(value, { required: true }))
  @IsNumber()
  public lon: number;
}

export class BenchBoxQueryDto {
  @Transform(({ value }) => toNumber(value, { required: true }))
  @IsNumber()
  public lat1: number;

  @Transform(({ value }) => toNumber(value, { required: true }))
  @IsNumber()
  public lon1: number;

  @Transform(({ value }) => toNumber(value, { required: true }))
  @IsNumber()
  public lat2: number;

  @Transform(({ value }) => toNumber(value, { required: true }))
  @IsNumber()
  public lon2: number;
}
