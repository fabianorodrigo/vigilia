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
import {OrdemServico} from '../models';
import {OrdemServicoRepository} from '../repositories';

export class OrdemServicoController {
  constructor(
    @repository(OrdemServicoRepository)
    public ordemServicoRepository : OrdemServicoRepository,
  ) {}

  @post('/ordens-servico', {
    responses: {
      '200': {
        description: 'OrdemServico model instance',
        content: {'application/json': {schema: {'x-ts-type': OrdemServico}}},
      },
    },
  })
  async create(@requestBody() ordemServico: OrdemServico): Promise<OrdemServico> {
    return await this.ordemServicoRepository.create(ordemServico);
  }

  @get('/ordens-servico/count', {
    responses: {
      '200': {
        description: 'OrdemServico model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(OrdemServico)) where?: Where,
  ): Promise<Count> {
    return await this.ordemServicoRepository.count(where);
  }

  @get('/ordens-servico', {
    responses: {
      '200': {
        description: 'Array of OrdemServico model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': OrdemServico}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(OrdemServico)) filter?: Filter,
  ): Promise<OrdemServico[]> {
    return await this.ordemServicoRepository.find(filter);
  }

  @patch('/ordens-servico', {
    responses: {
      '200': {
        description: 'OrdemServico PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() ordemServico: OrdemServico,
    @param.query.object('where', getWhereSchemaFor(OrdemServico)) where?: Where,
  ): Promise<Count> {
    return await this.ordemServicoRepository.updateAll(ordemServico, where);
  }

  @get('/ordens-servico/{id}', {
    responses: {
      '200': {
        description: 'OrdemServico model instance',
        content: {'application/json': {schema: {'x-ts-type': OrdemServico}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<OrdemServico> {
    return await this.ordemServicoRepository.findById(id);
  }

  @patch('/ordens-servico/{id}', {
    responses: {
      '204': {
        description: 'OrdemServico PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() ordemServico: OrdemServico,
  ): Promise<void> {
    await this.ordemServicoRepository.updateById(id, ordemServico);
  }

  @put('/ordens-servico/{id}', {
    responses: {
      '204': {
        description: 'OrdemServico PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ordemServico: OrdemServico,
  ): Promise<void> {
    await this.ordemServicoRepository.replaceById(id, ordemServico);
  }

  @del('/ordens-servico/{id}', {
    responses: {
      '204': {
        description: 'OrdemServico DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ordemServicoRepository.deleteById(id);
  }
}
