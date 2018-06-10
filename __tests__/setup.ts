import { configure } from "enzyme";

import * as Adapter from "enzyme-adapter-react-16";

// http://airbnb.io/enzyme/docs/guides/migration-from-2-to-3.html#configuring-your-adapter
configure({ adapter: new Adapter() });
