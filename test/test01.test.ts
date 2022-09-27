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
 1,000 + 1,000 + 5,000 + 3,000 + 2,000 = 12,000ms
               ↓ Parallel execution
            5,705ms

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
*/
