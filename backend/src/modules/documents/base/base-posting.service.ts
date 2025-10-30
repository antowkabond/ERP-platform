import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

/**
 * Base posting service for all documents (1C-style)
 * Provides common posting/unposting logic with transaction support
 */
export abstract class BasePostingService<TDocument, TResponse> {
  protected abstract readonly logger: Logger;
  protected abstract readonly prisma: PrismaService;
  protected abstract readonly repository: any;

  /**
   * Post document - generates register movements and accounting entries
   */
  async post(id: string): Promise<TResponse> {
    this.logger.log(`Posting document with id: ${id}`);

    const document = await this.repository.findById(id);
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    if (document.state === 'POSTED') {
      throw new BadRequestException('Document is already posted');
    }

    // Validate before posting
    await this.validateBeforePosting(document);

    // Use transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // 1. Run custom validation logic
      await this.validateInTransaction(document, tx);

      // 2. Mark document as posted
      await this.repository.markAsPosted(id);

      // 3. Generate register movements
      await this.generateRegisterMovements(document, tx);

      // 4. Generate accounting entries
      await this.generateAccountingEntries(document, tx);

      // 5. Run post-posting logic
      await this.afterPosting(document, tx);

      this.logger.log(`✅ Document posted successfully: ${document.number}`);

      // Return updated document
      const posted = await this.repository.findById(id);
      return this.toResponse(posted);
    });
  }

  /**
   * Unpost document - removes all register movements and accounting entries
   */
  async unpost(id: string): Promise<TResponse> {
    this.logger.log(`Unposting document with id: ${id}`);

    const document = await this.repository.findById(id);
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    if (document.state !== 'POSTED') {
      throw new BadRequestException('Document is not posted');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete register movements
      await this.deleteRegisterMovements(document, tx);

      // 2. Delete accounting entries
      await this.deleteAccountingEntries(document, tx);

      // 3. Run post-unposting logic
      await this.afterUnposting(document, tx);

      // 4. Mark document as unposted
      await this.repository.markAsUnposted(id);

      this.logger.log(`✅ Document unposted successfully: ${document.number}`);

      const unposted = await this.repository.findById(id);
      return this.toResponse(unposted);
    });
  }

  /**
   * Validate document before posting
   * Override in subclasses for custom validation
   */
  protected async validateBeforePosting(document: TDocument): Promise<void> {
    // Default validation - override in subclasses
  }

  /**
   * Validate document within transaction
   * Override in subclasses for validation that needs database access
   */
  protected async validateInTransaction(document: TDocument, tx: any): Promise<void> {
    // Default validation - override in subclasses
  }

  /**
   * Generate register movements
   * Must be implemented by subclasses
   */
  protected abstract generateRegisterMovements(document: TDocument, tx: any): Promise<void>;

  /**
   * Generate accounting entries
   * Must be implemented by subclasses
   */
  protected abstract generateAccountingEntries(document: TDocument, tx: any): Promise<void>;

  /**
   * Delete register movements during unposting
   * Must be implemented by subclasses
   */
  protected abstract deleteRegisterMovements(document: TDocument, tx: any): Promise<void>;

  /**
   * Delete accounting entries during unposting
   * Must be implemented by subclasses
   */
  protected abstract deleteAccountingEntries(document: TDocument, tx: any): Promise<void>;

  /**
   * Hook called after successful posting
   * Override in subclasses for custom logic
   */
  protected async afterPosting(document: TDocument, tx: any): Promise<void> {
    // Default no-op - override in subclasses
  }

  /**
   * Hook called after successful unposting
   * Override in subclasses for custom logic
   */
  protected async afterUnposting(document: TDocument, tx: any): Promise<void> {
    // Default no-op - override in subclasses
  }

  /**
   * Convert domain entity to response DTO
   * Must be implemented by subclasses
   */
  protected abstract toResponse(document: TDocument): TResponse;
}
