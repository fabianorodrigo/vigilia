import {DefaultCrudRepository} from '@loopback/repository';
import {Fornecedor} from '../models';
import {VigiliaDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FornecedorRepository extends DefaultCrudRepository<
  Fornecedor,
  typeof Fornecedor.prototype.cnpj
> {
  constructor(
    @inject('datasources.vigilia') dataSource: VigiliaDataSource,
  ) {
    super(Fornecedor, dataSource);
  }
}
