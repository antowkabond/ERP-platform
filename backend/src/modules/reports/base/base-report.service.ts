import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

/**
 * Base service for all reports (1C-style)
 * Provides common report generation, drill-down, and export logic
 */
export abstract class BaseReportService<TConfig, TReportData, TDrillDownData> {
  protected abstract readonly logger: Logger;
  protected abstract readonly prisma: PrismaService;
  protected abstract readonly reportName: string;

  /**
   * Generate report with given configuration
   */
  async generate(config: TConfig): Promise<{
    config: TConfig;
    data: TReportData;
    generatedAt: Date;
  }> {
    this.logger.log(`Generating ${this.reportName} report`);

    const startTime = Date.now();
    const data = await this.generateReportData(config);
    const duration = Date.now() - startTime;

    this.logger.log(`${this.reportName} report generated in ${duration}ms`);

    return {
      config,
      data,
      generatedAt: new Date(),
    };
  }

  /**
   * Drill down to see detailed data for a specific cell/value
   */
  async drillDown(config: TConfig, dimensions: any): Promise<TDrillDownData> {
    this.logger.log(`Drilling down in ${this.reportName} report`);

    const data = await this.generateDrillDownData(config, dimensions);

    return data;
  }

  /**
   * Export report to Excel format
   * Returns buffer that can be sent as file download
   */
  async exportToExcel(config: TConfig): Promise<Buffer> {
    this.logger.log(`Exporting ${this.reportName} report to Excel`);

    const report = await this.generate(config);
    const buffer = await this.generateExcelBuffer(report);

    this.logger.log(`${this.reportName} Excel export completed`);
    return buffer;
  }

  /**
   * Export report to PDF format
   * Returns buffer that can be sent as file download
   */
  async exportToPdf(config: TConfig): Promise<Buffer> {
    this.logger.log(`Exporting ${this.reportName} report to PDF`);

    const report = await this.generate(config);
    const buffer = await this.generatePdfBuffer(report);

    this.logger.log(`${this.reportName} PDF export completed`);
    return buffer;
  }

  /**
   * Generate the actual report data
   * Must be implemented by subclasses with specific query logic
   */
  protected abstract generateReportData(config: TConfig): Promise<TReportData>;

  /**
   * Drill down to source documents
   * Must be implemented by subclasses
   */
  protected abstract generateDrillDownData(
    config: TConfig,
    dimensions: any,
  ): Promise<TDrillDownData>;

  /**
   * Generate Excel file buffer
   * Can be overridden by subclasses for custom formatting
   */
  protected async generateExcelBuffer(report: {
    config: TConfig;
    data: TReportData;
    generatedAt: Date;
  }): Promise<Buffer> {
    // Default implementation - override in subclasses
    // Would use exceljs library here
    throw new Error('Excel export not implemented for this report');
  }

  /**
   * Generate PDF file buffer
   * Can be overridden by subclasses for custom formatting
   */
  protected async generatePdfBuffer(report: {
    config: TConfig;
    data: TReportData;
    generatedAt: Date;
  }): Promise<Buffer> {
    // Default implementation - override in subclasses
    // Would use pdfkit or puppeteer library here
    throw new Error('PDF export not implemented for this report');
  }

  /**
   * Validate report configuration
   * Override in subclasses for custom validation
   */
  protected validateConfig(config: TConfig): void {
    // Default validation - override in subclasses
  }

  /**
   * Apply filters to a query based on report configuration
   * Helper method for subclasses
   */
  protected applyDateFilter(filters: any, dateFrom?: Date, dateTo?: Date): any {
    if (dateFrom || dateTo) {
      filters.date = {};
      if (dateFrom) filters.date.gte = dateFrom;
      if (dateTo) filters.date.lte = dateTo;
    }
    return filters;
  }

  /**
   * Apply pagination to results
   * Helper method for subclasses
   */
  protected applyPagination<T>(
    data: T[],
    page?: number,
    perPage?: number,
  ): {
    data: T[];
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  } {
    const currentPage = page || 1;
    const itemsPerPage = perPage || 50;
    const total = data.length;
    const totalPages = Math.ceil(total / itemsPerPage);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);

    return {
      data: paginatedData,
      pagination: {
        page: currentPage,
        perPage: itemsPerPage,
        total,
        totalPages,
      },
    };
  }
}
