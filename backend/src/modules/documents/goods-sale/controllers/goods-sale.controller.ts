import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoodsSaleService } from '../services/goods-sale.service';
import { CreateGoodsSaleDto, UpdateGoodsSaleDto, GoodsSaleResponse } from '../dtos';

@ApiTags('Documents - GoodsSale')
@Controller('api/v1/documents/goods-sale')
export class GoodsSaleController {
  constructor(private readonly service: GoodsSaleService) {}

  @Get()
  @ApiOperation({ summary: 'List all goods sale documents' })
  @ApiResponse({ status: 200, description: 'List of documents', type: [GoodsSaleResponse] })
  async findAll(): Promise<GoodsSaleResponse[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get goods sale by ID' })
  @ApiResponse({ status: 200, description: 'Document details', type: GoodsSaleResponse })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findById(@Param('id') id: string): Promise<GoodsSaleResponse> {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new goods sale document' })
  @ApiResponse({ status: 201, description: 'Document created', type: GoodsSaleResponse })
  async create(@Body() dto: CreateGoodsSaleDto): Promise<GoodsSaleResponse> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update goods sale document' })
  @ApiResponse({ status: 200, description: 'Document updated', type: GoodsSaleResponse })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 400, description: 'Cannot update posted document' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGoodsSaleDto,
  ): Promise<GoodsSaleResponse> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete goods sale document (soft delete)' })
  @ApiResponse({ status: 204, description: 'Document deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete posted document' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }

  @Post(':id/post')
  @ApiOperation({
    summary: 'Post goods sale document',
    description: 'Posts the document and generates register movements and accounting entries',
  })
  @ApiResponse({ status: 200, description: 'Document posted', type: GoodsSaleResponse })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 400, description: 'Document already posted or invalid' })
  async post(@Param('id') id: string): Promise<GoodsSaleResponse> {
    return this.service.post(id);
  }

  @Post(':id/unpost')
  @ApiOperation({
    summary: 'Unpost goods sale document',
    description: 'Unposts the document and removes all register movements and accounting entries',
  })
  @ApiResponse({ status: 200, description: 'Document unposted', type: GoodsSaleResponse })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 400, description: 'Document not posted' })
  async unpost(@Param('id') id: string): Promise<GoodsSaleResponse> {
    return this.service.unpost(id);
  }
}
