const { getMessage } = require('../src/app');

describe('getMessage', () => {
  test('returns the demo message', () => {
    expect(getMessage()).toBe('Hello from the CI/CD pipeline demo app');
  });
});
