import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Fornecedor extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  cnpj: string;

  @property({
    type: 'string',
    required: true,
  })
  razaoSocial: string;

  @property({
    type: 'string',
  })
  nomeFantasia?: string;

  @property({
    type: 'string',
  })
  url?: string;

  constructor(data?: Partial<Fornecedor>) {
    super(data);
  }
}
