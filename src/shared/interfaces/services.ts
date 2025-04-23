export interface BaseService<T, C, U, F> {
    create(dto: C): Promise<T>;
    findById(id: string): Promise<T>;
    findAll(filter?: F): Promise<T[]>;
    update(id: string, dto: U): Promise<T>;
    delete(id: string): Promise<boolean>;
  }