import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Machines from "./Machines";
import { NodeActions, NodeStatusCode } from "app/store/types/node";
import { ScriptResultStatus } from "app/store/scriptresult/types";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  routerState as routerStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Machines", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        osInfo: {
          data: {
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          },
          errors: {},
          loaded: true,
          loading: false,
        },
        version: {
          data: "2.8.0",
          loaded: true,
          loading: false,
        },
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 4,
            cpu_test_status: {
              status: ScriptResultStatus.RUNNING,
            },
            distro_series: "bionic",
            domain: {
              name: "example",
            },
            extra_macs: [],
            fqdn: "koala.example",
            hostname: "koala",
            ip_addresses: [],
            memory: 8,
            memory_test_status: {
              status: ScriptResultStatus.PASSED,
            },
            network_test_status: {
              status: ScriptResultStatus.PASSED,
            },
            osystem: "ubuntu",
            owner: "admin",
            permissions: ["edit", "delete"],
            physical_disk_count: 1,
            pool: {},
            pxe_mac: "00:11:22:33:44:55",
            spaces: [],
            status: "Deployed",
            status_code: NodeStatusCode.DEPLOYED,
            status_message: "",
            storage: 8,
            storage_test_status: {
              status: ScriptResultStatus.PASSED,
            },
            testing_status: {
              status: ScriptResultStatus.PASSED,
            },
            system_id: "abc123",
            zone: modelRefFactory(),
          }),
          machineFactory({
            actions: [],
            architecture: "amd64/generic",
            cpu_count: 2,
            cpu_test_status: {
              status: ScriptResultStatus.FAILED,
            },
            distro_series: "xenial",
            domain: {
              name: "example",
            },
            extra_macs: [],
            fqdn: "other.example",
            hostname: "other",
            ip_addresses: [],
            memory: 6,
            memory_test_status: {
              status: ScriptResultStatus.FAILED,
            },
            network_test_status: {
              status: ScriptResultStatus.FAILED,
            },
            osystem: "ubuntu",
            owner: "user",
            permissions: ["edit", "delete"],
            physical_disk_count: 2,
            pool: {},
            pxe_mac: "66:77:88:99:00:11",
            spaces: [],
            status: "Releasing",
            status_code: NodeStatusCode.RELEASING,
            status_message: "",
            storage: 16,
            storage_test_status: {
              status: ScriptResultStatus.FAILED,
            },
            testing_status: {
              status: ScriptResultStatus.FAILED,
            },
            system_id: "def456",
            zone: modelRefFactory(),
          }),
        ],
        statuses: {
          abc123: {},
          def456: {},
        },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({
            id: 0,
            name: "default",
            description: "default",
            is_default: true,
            permissions: [],
          }),
          resourcePoolFactory({
            id: 1,
            name: "Backup",
            description: "A backup pool",
            is_default: false,
            permissions: [],
          }),
        ],
      }),
      router: routerStateFactory(),
    });
  });

  it("correctly routes to machine list", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MachineList").length).toBe(1);
  });

  it("correctly routes to add machine form", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddMachineForm").length).toBe(1);
  });

  it("correctly routes to add chassis form", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("AddChassisForm").length).toBe(1);
  });

  it("correctly routes to pools tab", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Pools").length).toBe(1);
  });

  it("correctly routes to add pool form", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/pools/add", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("PoolAdd").length).toBe(1);
  });

  it("correctly routes to not found component if url does not match", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/qwerty", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NotFound").length).toBe(1);
  });

  it("can set the search from the URL", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MachineList").prop("searchFilter")).toBe(
      "test search"
    );
  });

  it("updates the filter when the page changes", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("MachineListHeader Link[to='/pools']")
      .simulate("click", { button: 0 });
    wrapper.update();
    wrapper
      .find("Link[to='/machines?pool=%3Ddefault']")
      .simulate("click", { button: 0 });
    wrapper.update();
    expect(wrapper.find("MachineList").prop("searchFilter")).toBe(
      "pool:(=default)"
    );
  });

  it("changes the URL when the search text changes", () => {
    let location;
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <Machines />
          <Route
            path="*"
            render={(props) => {
              location = props.location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("MachineList").props().setSearchFilter("status:new");
    });
    expect(location.search).toBe("?status=new");
  });

  it("closes the take action form when route changes from /machines", () => {
    const state = { ...initialState };
    state.machine.selected = ["abc123"];
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Machines />
        </MemoryRouter>
      </Provider>
    );
    // Open action form
    act(() =>
      wrapper
        .find("TakeActionMenu")
        .props()
        .setSelectedAction({ name: NodeActions.SET_POOL })
    );
    wrapper.update();
    expect(wrapper.find("ActionFormWrapper").exists()).toBe(true);

    // Click pools tab, action form should close
    act(() => {
      wrapper
        .find("MachineListHeader Link[to='/pools']")
        .simulate("click", { button: 0 });
    });
    wrapper.update();
    expect(wrapper.find("ActionFormWrapper").exists()).toBe(false);
  });
});
