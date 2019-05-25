import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Contrato extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  numeroProcesso: string;

  @property({
    type: 'date',
    required: true,
  })
  dataInicio: string;

  @property({
    type: 'date',
  })
  dataFim?: string;

  @property({
    type: 'string',
    required: true,
  })
  cnpjFornecedor: string;


  constructor(data?: Partial<Contrato>) {
    super(data);
  }
}
