import { TSize } from "@customTypes/common";
import { TUserFromSearch } from "@customTypes/users";

export interface IUserAvatarProps {
  user: TUserFromSearch;
  showName?: boolean;
  onClick?: () => void;
  size?: TSize;
  pointer?: boolean;
  withAnimation?: boolean;
  className?: string;
}

export interface IUserAvatarLoadingProps
  extends Pick<IUserAvatarProps, "showName"> {}
