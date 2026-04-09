import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CounterpartyService } from '../services/counterparty.service';
import { CreateCounterpartyDto, UpdateCounterpartyDto, CounterpartyResponse } from '../dtos';

@ApiTags('Catalogs - Counterparty')
@Controller('api/v1/catalogs/counterparty')
export class CounterpartyController {
  constructor(private readonly service: CounterpartyService) {}

  @Get()
  @ApiOperation({ summary: 'List all counterparties' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by code, name, or tax number' })
  @ApiQuery({ name: 'type', required: false, enum: ['customer', 'supplier'], description: 'Filter by type' })
  @ApiResponse({ status: 200, description: 'List of counterparties', type: [CounterpartyResponse] })
  async findAll(
    @Query('search') search?: string,
    @Query('type') type?: 'customer' | 'supplier',
  ): Promise<CounterpartyResponse[]> {
    if (search) {
      return this.service.search(search);
    }
    if (type === 'customer') {
      return this.service.findCustomers();
    }
    if (type === 'supplier') {
      return this.service.findSuppliers();
    }
    return this.service.findAll();
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get counterparty hierarchy' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Parent ID to get children' })
  @ApiResponse({ status: 200, description: 'Hierarchical list', type: [CounterpartyResponse] })
  async getHierarchy(@Query('parentId') parentId?: string): Promise<CounterpartyResponse[]> {
    return this.service.getHierarchy(parentId || null);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get counterparty by ID' })
  @ApiResponse({ status: 200, description: 'Counterparty details', type: CounterpartyResponse })
  @ApiResponse({ status: 404, description: 'Counterparty not found' })
  async findById(@Param('id') id: string): Promise<CounterpartyResponse> {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new counterparty' })
  @ApiResponse({ status: 201, description: 'Counterparty created', type: CounterpartyResponse })
  @ApiResponse({ status: 409, description: 'Code already exists' })
  async create(@Body() dto: CreateCounterpartyDto): Promise<CounterpartyResponse> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update counterparty' })
  @ApiResponse({ status: 200, description: 'Counterparty updated', type: CounterpartyResponse })
  @ApiResponse({ status: 404, description: 'Counterparty not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCounterpartyDto,
  ): Promise<CounterpartyResponse> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete counterparty (soft delete)' })
  @ApiResponse({ status: 204, description: 'Counterparty deleted' })
  @ApiResponse({ status: 404, description: 'Counterparty not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
