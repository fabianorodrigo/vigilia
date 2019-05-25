import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Contrato} from '../models';
import {ContratoRepository} from '../repositories';

export class ContratoController {
  constructor(
    @repository(ContratoRepository)
    public contratoRepository : ContratoRepository,
  ) {}

  @post('/contratos', {
    responses: {
      '200': {
        description: 'Contrato model instance',
        content: {'application/json': {schema: {'x-ts-type': Contrato}}},
      },
    },
  })
  async create(@requestBody() contrato: Contrato): Promise<Contrato> {
    return await this.contratoRepository.create(contrato);
  }

  @get('/contratos/count', {
    responses: {
      '200': {
        description: 'Contrato model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Contrato)) where?: Where,
  ): Promise<Count> {
    return await this.contratoRepository.count(where);
  }

  @get('/contratos', {
    responses: {
      '200': {
        description: 'Array of Contrato model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Contrato}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Contrato)) filter?: Filter,
  ): Promise<Contrato[]> {
    return await this.contratoRepository.find(filter);
  }

  @patch('/contratos', {
    responses: {
      '200': {
        description: 'Contrato PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() contrato: Contrato,
    @param.query.object('where', getWhereSchemaFor(Contrato)) where?: Where,
  ): Promise<Count> {
    return await this.contratoRepository.updateAll(contrato, where);
  }

  @get('/contratos/{id}', {
    responses: {
      '200': {
        description: 'Contrato model instance',
        content: {'application/json': {schema: {'x-ts-type': Contrato}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Contrato> {
    return await this.contratoRepository.findById(id);
  }

  @patch('/contratos/{id}', {
    responses: {
      '204': {
        description: 'Contrato PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() contrato: Contrato,
  ): Promise<void> {
    await this.contratoRepository.updateById(id, contrato);
  }

  @put('/contratos/{id}', {
    responses: {
      '204': {
        description: 'Contrato PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() contrato: Contrato,
  ): Promise<void> {
    await this.contratoRepository.replaceById(id, contrato);
  }

  @del('/contratos/{id}', {
    responses: {
      '204': {
        description: 'Contrato DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.contratoRepository.deleteById(id);
  }
}
