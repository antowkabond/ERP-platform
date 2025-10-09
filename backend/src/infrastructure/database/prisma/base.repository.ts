/**
 * Base Repository Pattern
 * Provides common CRUD operations for all entities
 */
export abstract class BaseRepository<T> {
  abstract get model(): any;

  /**
   * Find all active records
   */
  async findAll(where: any = {}): Promise<T[]> {
    return this.model.findMany({
      where: { ...where, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find one by ID
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  /**
   * Find one by criteria
   */
  async findOne(where: any): Promise<T | null> {
    return this.model.findFirst({
      where,
    });
  }

  /**
   * Find many with pagination
   */
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
    include?: any;
  }): Promise<T[]> {
    const { skip, take, where, orderBy, include } = params;
    return this.model.findMany({
      skip,
      take,
      where: { ...where, isActive: true },
      orderBy: orderBy || { createdAt: 'desc' },
      include,
    });
  }

  /**
   * Count records
   */
  async count(where: any = {}): Promise<number> {
    return this.model.count({
      where: { ...where, isActive: true },
    });
  }

  /**
   * Create new record
   */
  async create(data: any): Promise<T> {
    return this.model.create({
      data: {
        ...data,
        isActive: true,
      },
    });
  }

  /**
   * Update record by ID
   */
  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Soft delete (set isActive = false)
   */
  async delete(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Hard delete (permanent)
   */
  async hardDelete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Restore soft-deleted record
   */
  async restore(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: {
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Find by code (for catalogs)
   */
  async findByCode(code: string): Promise<T | null> {
    return this.model.findUnique({
      where: { code },
    });
  }

  /**
   * Find hierarchy (for catalogs with parent-child)
   */
  async findHierarchy(parentId: string | null = null): Promise<T[]> {
    return this.model.findMany({
      where: {
        parentId,
        isActive: true,
      },
      orderBy: { code: 'asc' },
    });
  }

  /**
   * Check if code exists
   */
  async codeExists(code: string, excludeId?: string): Promise<boolean> {
    const count = await this.model.count({
      where: {
        code,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return count > 0;
  }
}
