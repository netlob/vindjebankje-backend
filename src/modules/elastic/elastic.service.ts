import { Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ElasticService extends ElasticsearchService {
  private readonly redis: RedisService;

  constructor(@Inject(RedisService) redis: RedisService) {
    super({ nodes: process.env.ELASTIC_URLS.split(',') });
    this.redis = redis;
    this._getSource = this._getSource.bind(this);
    this._sanitize = this._sanitize.bind(this);
  }

  private async getById<T>(id: number | string, type: Index) {
    // // check if item is present in cache
    // const cached: unknown = await this.redis.get(`elastic.cache.${type}.${id}`);
    // if (cached != null && cached != undefined) return cached as T;

    let item = await this.get({
      index: type,
      id: String(id),
    }).catch(() => null);

    item = this._getSource(item) as T;

    return item;
  }

  // private async getBulk<T>(
  //   ids: number[] | string[],
  //   type: Index,
  // ): Promise<T[]> {
  //   const items = (
  //     await this.search({
  //       index: type,
  //       size: ids.length,
  //       body: {
  //         query: {
  //           ids: {
  //             values: ids,
  //           },
  //         },
  //       },
  //     }).catch(() => null)
  //   )?.body?.hits?.hits?.map(this._getSource) as T[];

  //   return items;
  // }

  // private async setById<T>(
  //   id: number | string,
  //   type: Index,
  //   doc: ElasticObject & T,
  // ): Promise<unknown> {
  //   if (!id || !doc) return;

  //   doc.updatedAt = new Date();

  //   const { body } = await this.update(
  //     {
  //       index: type,
  //       id: String(id),
  //       refresh: 'wait_for',
  //       body: {
  //         doc,
  //         upsert: doc,
  //       },
  //     },
  //     {
  //       ignore: [409],
  //     },
  //   );
  //   return body;
  // }

  // private async setBulk<T>(
  //   type: Index,
  //   docs: (ElasticObject & T)[],
  // ): Promise<unknown> {
  //   if (!docs || docs?.length == 0) return;

  //   docs.forEach((doc) => (doc.updatedAt = new Date()));

  //   const body = docs.flatMap((doc: ElasticObject & T) => [
  //     {
  //       index: {
  //         _index: type,
  //         _id: doc.id,
  //       },
  //     },
  //     doc,
  //   ]);

  //   return await this.bulk({
  //     body,
  //     refresh: 'wait_for',
  //   });
  // }

  public _getSource(obj: any) {
    if (!obj) return obj;
    if (!('id' in obj._source)) obj._source.id = obj._id;
    obj._source.score = obj._score;
    return this._sanitize(obj._source);
  }

  private _sanitize(obj: any) {
    if (typeof obj != 'object') return obj;
    // delete (obj as unknown as ElasticObject).updatedAt;
    return obj;
  }
}

export enum Index {
  BENCH = 'bankjes2',
}

export interface ElasticObject {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
