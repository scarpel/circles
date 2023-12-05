import React from "react";

import { FiMessageCircle } from "react-icons/fi";

export default function NoItems() {
  return (
    <div className="px-8 text-center mt-24">
      <FiMessageCircle className="text-6xl mx-auto" />
      <p className="m-0 p-0 mt-4 text-sm opacity-40">
        You do not have any conversation. Start one by searching for a username
        above!
      </p>
    </div>
  );
}
