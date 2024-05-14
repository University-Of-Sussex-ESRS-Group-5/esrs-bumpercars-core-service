import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { Config } from './types';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as ejs from 'ejs';

export default (): Config => {
  const configTemplate = readFileSync('./src/config/config.yaml', 'utf8');
  // const configTemplate = readFileSync(join(__dirname, 'config.yaml'), 'utf8');
  const configString = ejs.render(configTemplate);

  const config = plainToInstance(
    Config,
    yaml.load(configString, { schema: yaml.JSON_SCHEMA }) as Config,
    { enableImplicitConversion: true },
  );

  const errors = validateSync(config, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
};
