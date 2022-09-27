# jest-async

Simplify Jest parallel testing.  
This allows you to write fast test code.  

The return value of each test can be received by Promise.  
You can synchronize by waiting for them with "await".  

## Example

- Async Test

```ts
import { testAsync, beforeAllAsync, afterAllAsync } from "jest-async";

const sleep = (value: number) =>
  new Promise((resolve) => setTimeout(resolve, value));

describe("Test", () => {
  const initWait = beforeAllAsync(async () => {
    await sleep(1000);
    console.log("beforeAll");
  });
  const A = testAsync("A", async () => {
    await sleep(1000);
    await initWait;
    console.log("A");
    return 100;
  });
  const B = testAsync("B", async () => {
    await sleep(4000);
    await initWait;
    console.log("B");
    return 200;
  });
  testAsync("C", async () => {
    await sleep(3000);
    const value = (await A) + (await B);
    console.log("C", value);
    expect(value).toBe(300);
  });
  testAsync("D", async () => {
    await sleep(2000);
    console.log("D");
  });
  afterAllAsync(async () => {
    console.log("afterAll");
  });
});
/*
 1,000 + 1,000 + 4,000 + 3,000 + 2,000 = 11,000ms
               ↓ Parallel execution
            4,541ms

  console.log
    beforeAll

      at log (test/test01.test.ts:9:13)

  console.log
    A

      at log (test/test01.test.ts:14:13)

  console.log
    D

      at log (test/test01.test.ts:31:13)

  console.log
    B

      at log (test/test01.test.ts:20:13)

  console.log
    C 300

      at log (test/test01.test.ts:26:13)

  console.log
    afterAll

      at log (test/test01.test.ts:34:13)

 PASS  test/test01.test.ts
  Test
    √ A (1 ms)
    √ B (2990 ms)
    √ C
    √ D

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        4.541 s, estimated 5 s
*/
```

- Sync Test

```ts
import { beforeAllAsync, testSync, afterAllAsync } from "jest-async";

const sleep = (value: number) =>
  new Promise((resolve) => setTimeout(resolve, value));

describe("Test2", () => {
  const initWait = beforeAllAsync(async () => {
    await sleep(1000);
    console.log("beforeAll2");
  });
  const A = testSync("A2", async () => {
    await sleep(1000);
    await initWait;
    console.log("A2");
    return 100;
  });
  const B = testSync("B2", async () => {
    await sleep(4000);
    await initWait;
    console.log("B2");
    return 200;
  });
  testSync("C2", async () => {
    await sleep(3000);
    const value = (await A) + (await B);
    console.log("C2", value);
    expect(value).toBe(300);
  });
  testSync("D2", async () => {
    await sleep(2000);
    console.log("D2");
  });
  afterAllAsync(async () => {
    console.log("afterAll2");
  });
});

/*
  console.log
    beforeAll2

      at log (test/test02.test.ts:9:13)

  console.log
    A2

      at log (test/test02.test.ts:14:13)

  console.log
    B2

      at log (test/test02.test.ts:20:13)

  console.log
    C2 300

      at log (test/test02.test.ts:26:13)

  console.log
    D2

      at log (test/test02.test.ts:31:13)

  console.log
    afterAll2

      at log (test/test02.test.ts:34:13)

 PASS  test/test02.test.ts (11.329 s)
  Test2
    √ A2 (1018 ms)
    √ B2 (4003 ms)
    √ C2 (3011 ms)
    √ D2 (2008 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        11.596 s, estimated 12 s
```
