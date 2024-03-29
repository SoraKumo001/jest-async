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
*/
