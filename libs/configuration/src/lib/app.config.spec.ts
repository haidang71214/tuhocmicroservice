import { AppConfiguration } from './app.config';

describe('AppConfiguration', () => {
  let originalPort: string | undefined;

  beforeEach(() => {
    originalPort = process.env['PORT'];
  });

  afterEach(() => {
    if (originalPort !== undefined) {
      process.env['PORT'] = originalPort;
    } else {
      delete process.env['PORT'];
    }
  });

  it('should initialize with default port 3300 if PORT env is not set', () => {
    delete process.env['PORT'];
    const config = new AppConfiguration();
    expect(config.PORT).toBe(3300);
  });
});
