class Sync<T> {
  private promise: Promise<T>;
  private resolve!: (value: T) => void;
  constructor() {
    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  exec(proc: () => Promise<T>) {
    return async () => {
      const result = await proc();
      this.resolve(result);
      return result;
    };
  }
  lock() {
    return this.promise;
  }
}
export const beforeAllAsync = <T>(proc: () => Promise<T>, timeout?: number) => {
  const sync = new Sync<T>();
  beforeAll(sync.exec(proc), timeout);
  return sync.lock();
};
export const afterAllAsync = <T>(proc: () => Promise<T>, timeout?: number) => {
  const sync = new Sync<T>();
  afterAll(sync.exec(proc), timeout);
  return sync.lock();
};
export const testAsync = <T>(
  name: string,
  proc: () => Promise<T>,
  timeout?: number
): Promise<T> => {
  const sync = new Sync<T>();
  it.concurrent(name, sync.exec(proc), timeout);
  return sync.lock();
};
export const testSync = <T>(
  name: string,
  proc: () => Promise<T>,
  timeout?: number
): Promise<T> => {
  const sync = new Sync<T>();
  it(name, sync.exec(proc), timeout);
  return sync.lock();
};