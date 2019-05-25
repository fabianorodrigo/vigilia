import {DefaultCrudRepository} from '@loopback/repository';
import {Contrato} from '../models';
import {VigiliaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ContratoRepository extends DefaultCrudRepository<
  Contrato,
  typeof Contrato.prototype.id
> {
  constructor(
    @inject('datasources.vigilia') dataSource: VigiliaDataSource,
  ) {
    super(Contrato, dataSource);
  }
}
