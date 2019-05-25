import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Indicador extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nome: string;

  @property({
    type: 'string',
  })
  descricao?: string;

  @property({
    type: 'string',
    required: true,
  })
  idContrato: string;

  @property({
    type: 'string',
    required: true,
    default: 'OS',
  })
  escopo: string;

  @property({
    type: 'string',
    required: true,
    default: 'javascript',
  })
  linguagemExecucao: string;

  @property({
    type: 'string',
    required: true,
    default: 'return { valor: 1, cor: \'green\' };',
  })
  script: string;




  constructor(data?: Partial<Indicador>) {
    super(data);
  }
}
