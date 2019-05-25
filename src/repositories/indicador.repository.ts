import {DefaultCrudRepository} from '@loopback/repository';
import {Indicador} from '../models';
import {VigiliaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class IndicadorRepository extends DefaultCrudRepository<
  Indicador,
  typeof Indicador.prototype.id
> {
  constructor(
    @inject('datasources.vigilia') dataSource: VigiliaDataSource,
  ) {
    super(Indicador, dataSource);
  }
}
