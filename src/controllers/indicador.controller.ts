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
import {Indicador} from '../models';
import {IndicadorRepository} from '../repositories';

export class IndicadorController {
  constructor(
    @repository(IndicadorRepository)
    public indicadorRepository : IndicadorRepository,
  ) {}

  @post('/indicadores', {
    responses: {
      '200': {
        description: 'Indicador model instance',
        content: {'application/json': {schema: {'x-ts-type': Indicador}}},
      },
    },
  })
  async create(@requestBody() indicador: Indicador): Promise<Indicador> {
    return await this.indicadorRepository.create(indicador);
  }

  @get('/indicadores/count', {
    responses: {
      '200': {
        description: 'Indicador model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Indicador)) where?: Where,
  ): Promise<Count> {
    return await this.indicadorRepository.count(where);
  }

  @get('/indicadores', {
    responses: {
      '200': {
        description: 'Array of Indicador model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Indicador}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Indicador)) filter?: Filter,
  ): Promise<Indicador[]> {
    return await this.indicadorRepository.find(filter);
  }

  @patch('/indicadores', {
    responses: {
      '200': {
        description: 'Indicador PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() indicador: Indicador,
    @param.query.object('where', getWhereSchemaFor(Indicador)) where?: Where,
  ): Promise<Count> {
    return await this.indicadorRepository.updateAll(indicador, where);
  }

  @get('/indicadores/{id}', {
    responses: {
      '200': {
        description: 'Indicador model instance',
        content: {'application/json': {schema: {'x-ts-type': Indicador}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Indicador> {
    return await this.indicadorRepository.findById(id);
  }

  @patch('/indicadores/{id}', {
    responses: {
      '204': {
        description: 'Indicador PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() indicador: Indicador,
  ): Promise<void> {
    await this.indicadorRepository.updateById(id, indicador);
  }

  @put('/indicadores/{id}', {
    responses: {
      '204': {
        description: 'Indicador PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() indicador: Indicador,
  ): Promise<void> {
    await this.indicadorRepository.replaceById(id, indicador);
  }

  @del('/indicadores/{id}', {
    responses: {
      '204': {
        description: 'Indicador DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.indicadorRepository.deleteById(id);
  }
}
