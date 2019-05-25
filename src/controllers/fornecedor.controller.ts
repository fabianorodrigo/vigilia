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
import {Fornecedor} from '../models';
import {FornecedorRepository} from '../repositories';

export class FornecedorController {
  constructor(
    @repository(FornecedorRepository)
    public fornecedorRepository : FornecedorRepository,
  ) {}

  @post('/fornecedores', {
    responses: {
      '200': {
        description: 'Fornecedor model instance',
        content: {'application/json': {schema: {'x-ts-type': Fornecedor}}},
      },
    },
  })
  async create(@requestBody() fornecedor: Fornecedor): Promise<Fornecedor> {
    return await this.fornecedorRepository.create(fornecedor);
  }

  @get('/fornecedores/count', {
    responses: {
      '200': {
        description: 'Fornecedor model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Fornecedor)) where?: Where,
  ): Promise<Count> {
    return await this.fornecedorRepository.count(where);
  }

  @get('/fornecedores', {
    responses: {
      '200': {
        description: 'Array of Fornecedor model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Fornecedor}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Fornecedor)) filter?: Filter,
  ): Promise<Fornecedor[]> {
    return await this.fornecedorRepository.find(filter);
  }

  @patch('/fornecedores', {
    responses: {
      '200': {
        description: 'Fornecedor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() fornecedor: Fornecedor,
    @param.query.object('where', getWhereSchemaFor(Fornecedor)) where?: Where,
  ): Promise<Count> {
    return await this.fornecedorRepository.updateAll(fornecedor, where);
  }

  @get('/fornecedores/{id}', {
    responses: {
      '200': {
        description: 'Fornecedor model instance',
        content: {'application/json': {schema: {'x-ts-type': Fornecedor}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Fornecedor> {
    return await this.fornecedorRepository.findById(id);
  }

  @patch('/fornecedores/{id}', {
    responses: {
      '204': {
        description: 'Fornecedor PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() fornecedor: Fornecedor,
  ): Promise<void> {
    await this.fornecedorRepository.updateById(id, fornecedor);
  }

  @put('/fornecedores/{id}', {
    responses: {
      '204': {
        description: 'Fornecedor PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() fornecedor: Fornecedor,
  ): Promise<void> {
    await this.fornecedorRepository.replaceById(id, fornecedor);
  }

  @del('/fornecedores/{id}', {
    responses: {
      '204': {
        description: 'Fornecedor DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.fornecedorRepository.deleteById(id);
  }
}
