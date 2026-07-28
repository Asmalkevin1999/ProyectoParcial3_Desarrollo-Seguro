import jwtConfiguration from './jwt.configuration';

describe('jwtConfiguration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_ACCESS_EXPIRES;
    delete process.env.JWT_REFRESH_EXPIRES;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('provides fallback values when env vars are missing', () => {
    const config = jwtConfiguration();

    expect(config.jwt.accessSecret).toBeDefined();
    expect(config.jwt.refreshSecret).toBeDefined();
    expect(config.jwt.accessExpires).toBeDefined();
    expect(config.jwt.refreshExpires).toBeDefined();
  });
});
