import { Inject, Injectable, Logger } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN, RedisModuleOptions } from './redis.definition';
import { RedisClientType, SetOptions, createClient } from 'redis';
import { TGetFromCacheParams } from './redis.types';
import { TObject } from '@src/types/common';

@Injectable()
export class RedisService {
  public readonly client: RedisClientType;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: RedisModuleOptions,
  ) {
    this.client = createClient(this.options);

    this.doConnect();
  }

  async doConnect() {
    try {
      if (!this.client || this.client.isOpen) return;

      await this.client.connect();
    } catch (err) {
      Logger.error('Unable to connect to Redis', err);
    }
  }

  async set(key: string, value: string, expiration?: number) {
    this.client.set(key, value, expiration ? { EX: expiration } : {});
  }

  async setJSON(key: string, value: TObject<any>, expiration?: number) {
    this.set(key, JSON.stringify(value), expiration);
  }

  async getFromCache(
    key: string,
    getFunction: () => Promise<any>,
    { storeOnMiss = true, expiration }: TGetFromCacheParams = {},
  ) {
    if (!(await this.client.exists(key))) {
      const item = await getFunction();

      if (!storeOnMiss) return item;

      await this.set(key, item, expiration);
    }

    return this.client.get(key);
  }

  async getJSONFromCache(
    key: string,
    getFunction: () => Promise<any>,
    params?: TGetFromCacheParams,
  ) {
    const getJSONFunction = async () =>
      getFunction().then((value) => JSON.stringify(value));

    return this.getFromCache(key, getJSONFunction, params).then((value) =>
      JSON.parse(value),
    );
  }

  async memo<T>({
    key,
    shouldSkipFunction = (value) => !!value,
    execute,
    options = {},
    storeReturnValue,
    getValue = () => true,
  }: {
    key: string;
    shouldSkipFunction?: (value: any) => boolean;
    execute: () => Promise<T> | T;
    options?: SetOptions;
    storeReturnValue?: boolean;
    getValue?: () => any;
  }): Promise<T | null> {
    const value = JSON.parse(await this.client.get(key));

    if (shouldSkipFunction(value)) return null;

    const returnValue = await execute();

    await this.client.set(
      key,
      JSON.stringify(storeReturnValue ? returnValue : getValue()),
      options,
    );

    return returnValue;
  }

  async scan(...props: Parameters<typeof this.client.scan>) {
    return this.client.scan(...props);
  }

  async deleteMatches(matchStr: string) {
    const { keys } = await this.scan(0, { MATCH: matchStr });

    if (!keys.length) return;

    return this.client.del(keys);
  }
}
