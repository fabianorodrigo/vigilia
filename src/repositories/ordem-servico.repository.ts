import {DefaultCrudRepository} from '@loopback/repository';
import {OrdemServico} from '../models';
import {VigiliaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OrdemServicoRepository extends DefaultCrudRepository<
  OrdemServico,
  typeof OrdemServico.prototype.id
> {
  constructor(
    @inject('datasources.vigilia') dataSource: VigiliaDataSource,
  ) {
    super(OrdemServico, dataSource);
  }
}
