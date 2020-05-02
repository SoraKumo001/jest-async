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
    await sleep(5000);
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
 1,000 + 1,000 + 5,000 + 3,000 + 2,000 = 12,000ms
               ↓ Parallel execution
            5,705ms

 PASS  src/index.test.ts (5.705s)
  ● Console
    console.log
      beforeAll
      at src/index.test.ts:9:13
    console.log
      A
      at src/index.test.ts:14:13
    console.log
      D
      at src/index.test.ts:31:13
    console.log
      B
      at src/index.test.ts:20:13
    console.log
      C 300
      at src/index.test.ts:26:13
    console.log
      afterAll
      at test/test01.test.ts:34:13

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        6.288s
Ran all test suites.
*/
```

- Sync Test

```.ts
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
    await sleep(5000);
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
      at test/test02.test.ts:9:13
  console.log
    A2
      at test/test02.test.ts:14:13
  console.log
    B2
      at test/test02.test.ts:20:13
  console.log
    C2 300
      at test/test02.test.ts:26:13
  console.log
    D2
      at test/test02.test.ts:31:13
  console.log
    afterAll2
      at test/test02.test.ts:34:13

  PASS  test/test02.test.ts (12.632s)
  Test2
    √ A2 (1016ms)
    √ B2 (5006ms)
    √ C2 (3015ms)
    √ D2 (2008ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        13.234s, estimated 14s
Ran all test suites.
*/
```
