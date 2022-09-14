import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

export class RedisService {
  constructor(@Inject(CACHE_MANAGER) public cacheManager: Cache) {}

  async set(key, value, options?: CachingConfig) {
    return this.cacheManager.set(key, value, options);
  }

  async get(key): Promise<unknown> {
    return this.cacheManager.get(key);
  }

  async del(key): Promise<void> {
    return this.cacheManager.del(key);
  }
}
