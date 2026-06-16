import { getProcessId } from './string.util';

describe('getProcessId', () => {
  it('should return a process ID with prefix if provided', () => {
    const prefix = 'test';
    const result = getProcessId(prefix);
    expect(result).toContain(prefix);
  });

  it('should return a process ID without prefix if not provided', () => {
    const result = getProcessId();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
