import { mount } from "enzyme";
import * as React from "react";

import { TodoFilter } from "app/constants";
import Footer from "../";

it("renders without any items", () => {
  const footer = mount(
    <Footer activeCount={0} completedCount={0} filter={TodoFilter.ACTIVE} />,
  );

  expect(
    footer.contains(
      <span>
        <strong>No</strong> items left
      </span>,
    ),
  ).toBeTruthy();
});
