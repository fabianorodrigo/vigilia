import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class OrdemServico extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  idContrato: string;

  @property({
    type: 'number',
    required: true,
  })
  numeroOS: number;

  @property({
    type: 'date',
    required: true,
  })
  dataAbertura: string;

  @property({
    type: 'date',
  })
  dataFechamento?: string;

  @property({
    type: 'string',
  })
  numeroSEI?: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  escopo: object[];

  constructor(data?: Partial<OrdemServico>) {
    super(data);
  }
}
