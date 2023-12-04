import { ICommonComponentProps } from "@customTypes/common";
import { Session } from "next-auth";

export interface IMainPageHeaderProps extends ICommonComponentProps {
  session?: Session | null;
  showNav?: boolean;
}

export interface ISignedProps {
  user: Session["user"];
}
