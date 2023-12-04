import { ConfigurableModuleBuilder } from '@nestjs/common';
import { RedisClientOptions, RedisModules } from 'redis';

export interface RedisModuleOptions
  extends RedisClientOptions<
    RedisModules,
    Record<string, never>,
    Record<string, never>
  > {}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<RedisModuleOptions>({
    moduleName: 'Redis',
  }).build();
