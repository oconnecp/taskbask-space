interface Cacheable<T> {
  data: T | null;
  type: string;
  callbacks: Array<(data: T) => void>;
}

export class CacheService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: { [key: string]: Cacheable<any> } = {};

  public initializeEntry<T>(key: string): void {
    const cacheEntry: Cacheable<T> = {
      data: null,
      callbacks: [],
      type: typeof ({} as T),
    };
    this.cache[key] = cacheEntry;
  }

  public checkEntry(key: string): boolean {
    return this.cache[key] !== undefined;
  }

  public set<T>(key: string, data: T): Promise<T> {
    if (!this.cache[key]) {
      throw new Error(`Cache entry for key "${key}" does not exist.`);
    }
    this.cache[key].data = data;
    this.cache[key].callbacks.forEach((callback) => callback(data));
    this.cache[key].callbacks = [];

    return Promise.resolve(data);
  }

  public get<T>(key: string): Promise<T> {
    if (this.cache[key] && this.cache[key].data !== null) {
      // callback(this.cache[key].data);
      return Promise.resolve(this.cache[key].data);
    } else {
      if (!this.cache[key]) {
        throw new Error(`Cache entry for key "${key}" does not exist.`);
      }
      // the data must be null
      return new Promise((resolve) => {
        this.cache[key].callbacks.push(resolve);
      });
    }
  }
}
