const {
  calculate,
  fahrenheitToCelcius,
  celciusToFahrenheit,
  add
} = require("../src/MATH.JS");

test("should calculate the tip", () => {
  const total = calculate(10, 0.3);
  expect(total).toBe(13);

  //   if (total !== 13) {
  //     throw new Error("tottal should be 13 got" + total);
  //   }
});

test("should concert celcius to fahrenheit", () => {
  const total = fahrenheitToCelcius(32);
  expect(total).toBe(0);
});

test("should convert from celcius to fahrenheit", () => {
  const total = celciusToFahrenheit(0);
  expect(total).toBe(32);
});
test("should calculate total with default tip", () => {
  const total = calculate(10);
  expect(total).toBe(12.5);
});

// test("async test case", done => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     done();
//   }, 2000);
// });

test("should add two umbers", done => {
  add(2, 3).then(sum => {
    expect(sum).toBe(5);
    done();
  });
});

test("should add two numbers ASYNC/AWAIT", async () => {
  const sum = await add(10, 15);
  expect(sum).toBe(25);
});
