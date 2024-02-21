import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { Config } from './types';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export default (): Config => {
  const config = plainToInstance(
    Config,
    yaml.load(readFileSync(join(__dirname, 'config.yaml'), 'utf8')),
    { enableImplicitConversion: true },
  );

  const errors = validateSync(config, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
};