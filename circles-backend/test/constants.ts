import { CreateUserDto } from '@modules/auth/dtos/create-user.dto';

export const mockUser: CreateUserDto = {
  email: 'test@test.com',
  name: 'Test Testson',
  password: 'Aa1#klasdasd',
  username: 'test',
};

export const johnMockUser: CreateUserDto = {
  email: 'john@test.com',
  name: 'John Doe',
  password: 'Aa1#klasdasd',
  username: 'john',
};

export const anaMockUser: CreateUserDto = {
  email: 'ana@test.com',
  name: 'Ana Doe',
  password: 'Aa1#klasdasd',
  username: 'ana',
};
