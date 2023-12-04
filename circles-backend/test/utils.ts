import { CreateUserDto } from '@modules/auth/dtos/create-user.dto';
import { TUserDocument } from '@schemas/user.schema';
import { Model } from 'mongoose';

export async function getErrorName(func: () => Promise<any> | any) {
  try {
    await func();
  } catch (err) {
    return err.name;
  }
}

export async function importMockUsers(
  users: CreateUserDto[],
  userModel: Model<TUserDocument>,
) {
  return Promise.all(users.map((user) => new userModel(user).save()));
}
