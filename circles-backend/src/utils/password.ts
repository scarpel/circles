import { hash, compare } from 'bcrypt';

export function hashPassword(
  password: string,
  saltOrRounds: number | string = 10,
) {
  return hash(password, saltOrRounds);
}

export function comparePassword(password: string, storedPassword: string) {
  return compare(password, storedPassword);
}
