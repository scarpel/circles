"use client";

import React, { useMemo, useState } from "react";
import TextInput from "@components/TextInput";
import { searchForUsername } from "@services/backend/users";
import { useDebounce } from "@uidotdev/usehooks";
import { useQuery } from "react-query";
import UsersContainer from "./UsersContainer";
import classNames from "classnames";
import { TUserFromSearch } from "@customTypes/users";
import { useDispatch } from "react-redux";
import { setfocusedConversationSearchKey } from "@redux/slices/conversationsSlice";

// Icon
import { FiSearch } from "react-icons/fi";

export default function UserSearch() {
  // Hooks
  const dispatch = useDispatch();

  // States
  const [usernameSearch, setUsernameSearch] = useState("");
  const debouncedUsernameSearch = useDebounce(usernameSearch, 250);

  // Fetch
  const { isLoading, isSuccess, data } = useQuery(
    ["users", debouncedUsernameSearch],
    () =>
      searchForUsername(debouncedUsernameSearch).then(({ data }: any) => data),
    {
      enabled: !!usernameSearch.length,
    }
  );

  const shouldShow = useMemo(
    () => isLoading || isSuccess || usernameSearch.length,
    [isLoading, isSuccess, usernameSearch]
  );

  // Functions
  const onUserSelect = (user: TUserFromSearch) => {
    setUsernameSearch("");
    dispatch(setfocusedConversationSearchKey(user.id));
  };

  // Render
  return (
    <section>
      <TextInput
        placeholder="Search for your friends"
        value={usernameSearch}
        onChange={setUsernameSearch}
        Icon={FiSearch}
      />
      <div
        className={classNames(
          "-mx-5 overflow-hidden transition-all ease-in-out duration-300",
          {
            "h-0": !shouldShow,
          }
        )}
      >
        <UsersContainer
          className="px-5"
          loading={isLoading}
          users={data}
          onUserSelect={onUserSelect}
        />
      </div>
    </section>
  );
}
