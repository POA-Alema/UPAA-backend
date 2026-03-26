describe("Placeholder tests", () => {
  test("should return true (placeholder)", () => {
    expect(true).toBe(true);
  });

  test("should be truthy (placeholder)", () => {
    expect(true).toBeTruthy();
  });

  test("values should match (placeholder)", () => {
    const expected = 1;
    const received = 1;
    expect(received).toBe(expected);
  });
});