import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChartOfAccountsService } from '../services/chart-of-accounts.service';
import { CreateChartOfAccountsDto, UpdateChartOfAccountsDto, ChartOfAccountsResponse } from '../dtos';

@ApiTags('Accounting - Chart of Accounts')
@Controller('api/v1/accounting/chart-of-accounts')
export class ChartOfAccountsController {
  constructor(private readonly chartOfAccountsService: ChartOfAccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chart of accounts entries' })
  @ApiResponse({ status: 200, description: 'List of accounts', type: [ChartOfAccountsResponse] })
  async findAll(): Promise<ChartOfAccountsResponse[]> {
    return this.chartOfAccountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chart of accounts entry by ID' })
  @ApiResponse({ status: 200, description: 'Account details', type: ChartOfAccountsResponse })
  async findById(@Param('id') id: string): Promise<ChartOfAccountsResponse> {
    return this.chartOfAccountsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new chart of accounts entry' })
  @ApiResponse({ status: 201, description: 'Account created', type: ChartOfAccountsResponse })
  async create(@Body() dto: CreateChartOfAccountsDto): Promise<ChartOfAccountsResponse> {
    return this.chartOfAccountsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chart of accounts entry' })
  @ApiResponse({ status: 200, description: 'Account updated', type: ChartOfAccountsResponse })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateChartOfAccountsDto,
  ): Promise<ChartOfAccountsResponse> {
    return this.chartOfAccountsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete chart of accounts entry' })
  @ApiResponse({ status: 204, description: 'Account deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.chartOfAccountsService.delete(id);
  }
}
