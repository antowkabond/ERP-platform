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
import { WarehouseService } from '../services/warehouse.service';
import { CreateWarehouseDto, UpdateWarehouseDto, WarehouseResponse } from '../dtos';

@ApiTags('Catalogs - Warehouse')
@Controller('api/v1/catalogs/warehouse')
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Get()
  @ApiOperation({ summary: 'List all warehouses' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by code, name, or address' })
  @ApiResponse({ status: 200, description: 'List of warehouses', type: [WarehouseResponse] })
  async findAll(@Query('search') search?: string): Promise<WarehouseResponse[]> {
    if (search) {
      return this.service.search(search);
    }
    return this.service.findAll();
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get warehouse hierarchy' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Parent ID to get children' })
  @ApiResponse({ status: 200, description: 'Hierarchical list', type: [WarehouseResponse] })
  async getHierarchy(@Query('parentId') parentId?: string): Promise<WarehouseResponse[]> {
    return this.service.getHierarchy(parentId || null);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiResponse({ status: 200, description: 'Warehouse details', type: WarehouseResponse })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async findById(@Param('id') id: string): Promise<WarehouseResponse> {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created', type: WarehouseResponse })
  @ApiResponse({ status: 409, description: 'Code already exists' })
  async create(@Body() dto: CreateWarehouseDto): Promise<WarehouseResponse> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse updated', type: WarehouseResponse })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWarehouseDto,
  ): Promise<WarehouseResponse> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete warehouse (soft delete)' })
  @ApiResponse({ status: 204, description: 'Warehouse deleted' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
