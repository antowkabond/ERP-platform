export abstract class BaseQuery {
  protected page?: number;
  protected perPage?: number;

  protected get skip(): number {
    return this.page && this.perPage ? (this.page - 1) * this.perPage : undefined;
  }

  protected get take(): number {
    return this.perPage;
  }
}

