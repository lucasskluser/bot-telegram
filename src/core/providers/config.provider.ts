import { injectable } from 'inversify';

@injectable()
export class ConfigProvider {
  public readonly map: Map<string, any>;

  constructor() {
    this.map = new Map<string, any>();
  }

  public set<T>(key: string, value: T): void {
    this.map.set(key, value);
  }

  public get<T>(key: string, defaultValue?: T): any {
    return this.map.get(key) ?? defaultValue;
  }

  public mapObject<T>(object: T, prefix?: string): void {
    for (const key in object) {
      const keyCamelCase: string = key
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');

      if (object[key] !== null && typeof object[key] === 'object' && !Array.isArray(object[key])) {
        this.mapObject(object[key], key);
      } else {
        if (prefix) {
          const prefixCamelCase: string = prefix
            .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
              return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/\s+/g, '');

          this.set(`${prefixCamelCase}:${keyCamelCase}`, object[key]);
        } else {
          this.set(keyCamelCase, object[key]);
        }
      }
    }
  }
}
