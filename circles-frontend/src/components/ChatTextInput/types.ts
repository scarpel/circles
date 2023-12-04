import { ICommonComponentProps } from "@customTypes/common";

export interface IChatTextInputProps extends ICommonComponentProps {
  value: string;
  onChange: (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  withSendIcon?: boolean;
  preventLineBreakOnEnter?: boolean;
  onSend: () => void;
}
