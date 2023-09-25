import { ValidationPipe } from './joiValidation.pipe';

describe('ValidationPipe', () => {
  it('should be defined', () => {
    expect(new ValidationPipe()).toBeDefined();
  });
});
