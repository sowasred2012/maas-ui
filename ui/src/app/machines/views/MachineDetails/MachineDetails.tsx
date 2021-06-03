import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";

import MachineComissioning from "./MachineCommissioning";
import MachineConfiguration from "./MachineConfiguration";
import MachineHeader from "./MachineHeader";
import MachineInstances from "./MachineInstances";
import MachineLogs from "./MachineLogs";
import MachineNetwork from "./MachineNetwork";
import NetworkNotifications from "./MachineNetwork/NetworkNotifications";
import MachinePCIDevices from "./MachinePCIDevices";
import MachineStorage from "./MachineStorage";
import StorageNotifications from "./MachineStorage/StorageNotifications";
import MachineSummary from "./MachineSummary";
import SummaryNotifications from "./MachineSummary/SummaryNotifications";
import MachineTests from "./MachineTests";
import MachineTestsDetails from "./MachineTests/MachineTestsDetails/MachineTestsDetails";
import MachineUSBDevices from "./MachineUSBDevices";
import type { SelectedAction } from "./types";

import Section from "app/base/components/Section";
import type { RouteParams } from "app/base/types";
import machineURLs from "app/machines/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

const MachineDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { pathname } = useLocation();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const [selectedAction, setSelectedAction] =
    useState<SelectedAction | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    dispatch(machineActions.get(id));
    // Set machine as active to ensure all machine data is sent from the server.
    dispatch(machineActions.setActive(id));

    // Unset active machine on cleanup.
    return () => {
      dispatch(machineActions.setActive(null));
      // Clean up any machine errors etc. when closing the details.
      dispatch(machineActions.cleanup());
    };
  }, [dispatch, id]);

  // Display a message if the machine does not exist.
  if (!machinesLoading && !machine) {
    return (
      <Section header="Machine not found" data-test="not-found">
        <p>
          Unable to find machine with system id "{id}".{" "}
          <Link to={machineURLs.machines.index}>View all machines</Link>.
        </p>
      </Section>
    );
  }

  return (
    <Section
      header={
        <MachineHeader
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
      }
      headerClassName="u-no-padding--bottom"
    >
      {machine && (
        <Switch>
          <Route exact path={machineURLs.machine.summary(null, true)}>
            <SummaryNotifications id={id} />
            <MachineSummary setSelectedAction={setSelectedAction} />
          </Route>
          <Route exact path={machineURLs.machine.instances(null, true)}>
            <MachineInstances />
          </Route>
          <Route exact path={machineURLs.machine.network(null, true)}>
            <NetworkNotifications id={id} />
            <MachineNetwork setSelectedAction={setSelectedAction} />
          </Route>
          <Route exact path={machineURLs.machine.storage(null, true)}>
            <StorageNotifications id={id} />
            <MachineStorage />
          </Route>
          <Route exact path={machineURLs.machine.pciDevices(null, true)}>
            <MachinePCIDevices setSelectedAction={setSelectedAction} />
          </Route>
          <Route exact path={machineURLs.machine.usbDevices(null, true)}>
            <MachineUSBDevices setSelectedAction={setSelectedAction} />
          </Route>
          <Route
            exact
            path={machineURLs.machine.commissioning.index(null, true)}
          >
            <MachineComissioning />
          </Route>
          <Route
            exact
            path={machineURLs.machine.commissioning.scriptResult(null, true)}
          >
            <MachineTestsDetails />
          </Route>
          <Route exact path={machineURLs.machine.testing.index(null, true)}>
            <MachineTests />
          </Route>
          <Route
            exact
            path={machineURLs.machine.testing.scriptResult(null, true)}
          >
            <MachineTestsDetails />
          </Route>
          <Route path={machineURLs.machine.logs.index(null, true)}>
            <MachineLogs systemId={id} />
          </Route>
          <Route exact path={machineURLs.machine.events(null, true)}>
            <Redirect to={machineURLs.machine.logs.events(null, true)} />
          </Route>
          <Route exact path={machineURLs.machine.configuration(null, true)}>
            <MachineConfiguration />
          </Route>
          <Route exact path={machineURLs.machine.index(null, true)}>
            <Redirect to={machineURLs.machine.summary({ id })} />
          </Route>
        </Switch>
      )}
    </Section>
  );
};

export default MachineDetails;
