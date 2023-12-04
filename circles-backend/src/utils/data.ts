import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function convertDataToDto<T>(
  data: any,
  dto: any,
  throwErrorIfInvalid: boolean = true,
) {
  const convertedData = plainToInstance(dto, data);

  const errors = await validate(convertedData);

  if (errors.length && throwErrorIfInvalid) throw errors[0];

  return errors.length ? null : (convertedData as T);
}
