import { ICommonComponentProps } from "@customTypes/common";

export type TSignUpForm = {
  email: string;
  password: string;
  username: string;
  name: string;
};

export type TSignUpFormWithSamePassword = TSignUpForm & {
  samePassword: string;
};

export interface ISignUpFormProps extends ICommonComponentProps {
  onSubmit: (values: TSignUpForm) => void | Promise<void>;
}
