export interface BaseRepository<T, K> {
    create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(filter?: K): Promise<T[]>;
    update(id: string, entity: Partial<T>): Promise<T>;
    delete(id: string): Promise<boolean>;
  }