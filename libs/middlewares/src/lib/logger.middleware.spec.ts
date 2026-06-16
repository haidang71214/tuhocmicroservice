import { LoggerMiddleware } from './logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    mockRequest = {
      method: 'GET',
      originalUrl: '/test',
      body: {},
    };
    mockResponse = {
      send: jest.fn().mockImplementation((body) => body),
    };
    nextFunction = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next()', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
