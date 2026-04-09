import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  private isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values: any): any {
    if (Array.isArray(values)) {
      return values.map((value) => this.trim(value));
    }

    if (this.isObject(values)) {
      return Object.keys(values).reduce((acc, key) => {
        acc[key] = this.trim(values[key]);
        return acc;
      }, {});
    }

    if (typeof values === 'string') {
      return values.trim();
    }

    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body' || type === 'query' || type === 'param') {
      return this.trim(values);
    }
    return values;
  }
}

