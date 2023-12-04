import { ICommonComponentProps } from "@customTypes/common";

export type TSignInForm = {
  email: string;
  password: string;
};

export interface ISignInFormProps extends ICommonComponentProps {
  onSubmit: (values: TSignInForm) => void | Promise<void>;
}
