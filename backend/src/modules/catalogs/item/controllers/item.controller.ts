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
import { ItemService } from '../services/item.service';
import { CreateItemDto, UpdateItemDto, ItemResponse } from '../dtos';

@ApiTags('Catalogs - Item')
@Controller('api/v1/catalogs/item')
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  @ApiOperation({ summary: 'List all items' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by code, name, or SKU' })
  @ApiQuery({ name: 'type', required: false, enum: ['inventory', 'service'], description: 'Filter by type' })
  @ApiResponse({ status: 200, description: 'List of items', type: [ItemResponse] })
  async findAll(
    @Query('search') search?: string,
    @Query('type') type?: 'inventory' | 'service',
  ): Promise<ItemResponse[]> {
    if (search) {
      return this.service.search(search);
    }
    if (type === 'inventory') {
      return this.service.findInventoryItems();
    }
    if (type === 'service') {
      return this.service.findServices();
    }
    return this.service.findAll();
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get item hierarchy' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Parent ID to get children' })
  @ApiResponse({ status: 200, description: 'Hierarchical list', type: [ItemResponse] })
  async getHierarchy(@Query('parentId') parentId?: string): Promise<ItemResponse[]> {
    return this.service.getHierarchy(parentId || null);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({ status: 200, description: 'Item details', type: ItemResponse })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findById(@Param('id') id: string): Promise<ItemResponse> {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new item' })
  @ApiResponse({ status: 201, description: 'Item created', type: ItemResponse })
  @ApiResponse({ status: 409, description: 'Code or SKU already exists' })
  async create(@Body() dto: CreateItemDto): Promise<ItemResponse> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'Item updated', type: ItemResponse })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<ItemResponse> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete item (soft delete)' })
  @ApiResponse({ status: 204, description: 'Item deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
