import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';

/**
 * Base service for all document types (1C-style)
 * Provides common CRUD operations that all documents share
 */
export abstract class BaseDocumentService<TDocument, TCreateDto, TUpdateDto, TResponse> {
  protected abstract readonly logger: Logger;
  protected abstract readonly repository: any;

  /**
   * Find all documents
   */
  async findAll(): Promise<TResponse[]> {
    this.logger.log('Finding all documents');
    const documents = await this.repository.findAll();
    return documents.map((doc: TDocument) => this.toResponse(doc));
  }

  /**
   * Find document by ID
   */
  async findById(id: string): Promise<TResponse> {
    this.logger.log(`Finding document by id: ${id}`);
    const document = await this.repository.findById(id);
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return this.toResponse(document);
  }

  /**
   * Create new document
   */
  async create(dto: TCreateDto): Promise<TResponse> {
    this.logger.log('Creating document');
    const document = await this.repository.create(dto);
    this.logger.log(`Document created with id: ${document.id}`);
    return this.toResponse(document);
  }

  /**
   * Update existing document
   */
  async update(id: string, dto: TUpdateDto): Promise<TResponse> {
    this.logger.log(`Updating document with id: ${id}`);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    if (existing.state === 'POSTED') {
      throw new BadRequestException('Cannot update posted document. Unpost it first.');
    }

    const document = await this.repository.update(id, dto);
    this.logger.log(`Document updated with id: ${id}`);
    return this.toResponse(document);
  }

  /**
   * Delete document (soft delete)
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting document with id: ${id}`);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    if (existing.state === 'POSTED') {
      throw new BadRequestException('Cannot delete posted document. Unpost it first.');
    }

    await this.repository.delete(id);
    this.logger.log(`Document deleted with id: ${id}`);
  }

  /**
   * Convert domain entity to response DTO
   * Must be implemented by subclasses
   */
  protected abstract toResponse(document: TDocument): TResponse;

  /**
   * Validate document before posting
   * Can be overridden by subclasses for custom validation
   */
  protected async validateBeforePosting(document: TDocument): Promise<void> {
    // Default validation - override in subclasses
  }
}
