import { Injectable } from '@nestjs/common';

/**
 * Base class for services with automatic soft delete.
 * All services should automatically filter by status: true.
 */
@Injectable()
export abstract class BaseService {
  /**
   * Wraps a where clause to automatically filter by status: true
   */
  protected addActiveFilter(where: any = {}) {
    return {
      ...where,
      status: true,
    };
  }

  /**
   * Creates data with status set to true by default
   */
  protected getCreateData(data: any) {
    return {
      ...data,
      status: true,
    };
  }

  /**
   * Marks a record as inactive (soft delete)
   */
  protected getSoftDeleteData() {
    return {
      status: false,
      updatedAt: new Date(),
    };
  }
}
