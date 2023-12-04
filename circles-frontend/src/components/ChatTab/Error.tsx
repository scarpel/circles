import React from "react";

import { TbMoodSad } from "react-icons/tb";

export default function Error() {
  return (
    <section className="text-center">
      <TbMoodSad className="text-8xl mx-auto" />

      <h2 className="text-sm opacity-50 mt-5">
        Ops... something went wrong!
        <br />
        Try again
      </h2>
    </section>
  );
}
