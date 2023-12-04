import UserAvatar from "@components/UserAvatar";
import UserAvatarLoading from "@components/UserAvatar/UserAvatarLoading";
import { ICommonComponentProps } from "@customTypes/common";
import { TUserFromSearch } from "@customTypes/users";
import classNames from "classnames";
import React, { useMemo } from "react";

interface IProps extends ICommonComponentProps {
  loading: boolean;
  users: TUserFromSearch[];
  onUserSelect: (user: TUserFromSearch) => void;
}

export default function UsersContainer({
  loading,
  users = [],
  className,
  onUserSelect,
}: IProps) {
  const shouldShow = useMemo(() => loading || users.length, [loading, users]);

  // Render
  if (!shouldShow) return null;

  const renderLoading = () => (
    <>
      <UserAvatarLoading />
      <UserAvatarLoading />
      <UserAvatarLoading />
      <UserAvatarLoading />
    </>
  );

  const renderContent = () =>
    users.map((user) => (
      <UserAvatar
        key={user.id}
        user={user}
        onClick={() => onUserSelect(user)}
        size="lg"
      />
    ));

  return (
    <div
      className={classNames(
        "px-3 py-5 space-x-4 flex overflow-scroll",
        className
      )}
    >
      {loading ? renderLoading() : renderContent()}
    </div>
  );
}
