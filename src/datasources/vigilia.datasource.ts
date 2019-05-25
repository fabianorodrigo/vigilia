import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './vigilia.datasource.json';

export class VigiliaDataSource extends juggler.DataSource {
  static dataSourceName = 'vigilia';

  constructor(
    @inject('datasources.config.vigilia', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
