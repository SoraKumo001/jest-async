import { testAsync, beforeAllAsync } from "jest-async";

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

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        6.288s
Ran all test suites.
*/