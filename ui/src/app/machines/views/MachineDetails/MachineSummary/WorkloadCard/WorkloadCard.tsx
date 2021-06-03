import {
  Card,
  Icon,
  Link,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import LabelledList from "app/base/components/LabelledList";
import { useSendAnalytics } from "app/base/hooks";
import { filtersToQueryString } from "app/machines/search";
import machineURLs from "app/machines/urls";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Machine["system_id"];
};

const WorkloadCard = ({ id }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const sendAnalytics = useSendAnalytics();
  let content: JSX.Element;

  if (isMachineDetails(machine)) {
    const workloads = Object.entries(machine.workload_annotations || {}).sort(
      (a, b) => a[0].localeCompare(b[0])
    );

    if (workloads.length > 0) {
      content = (
        <LabelledList
          className="u-no-margin--bottom"
          data-test="workload-annotations"
          items={workloads.map(([key, value]) => {
            const separatedValue = value.split(",");
            return {
              label: <div data-test="workload-key">{key}</div>,
              value: (
                <div data-test="workload-value" key={key}>
                  {separatedValue.map((val) => {
                    const filter = filtersToQueryString({
                      [`workload-${key}`]: [`${val}`],
                    });
                    return (
                      <div key={`${key}-${val}`}>
                        <RouterLink
                          to={`${machineURLs.machines.index}${filter}`}
                        >
                          {val}
                        </RouterLink>
                      </div>
                    );
                  })}
                </div>
              ),
            };
          })}
        />
      );
    } else {
      content = (
        <div data-test="no-workload-annotations">
          <h4>No workload information</h4>
        </div>
      );
    }
  } else {
    content = <Spinner />;
  }

  return (
    <div className="machine-summary__workload-card">
      <Card>
        <div className="u-flex--between">
          <div className="u-sv1">
            <strong className="p-muted-heading">Workload annotations</strong>
            <span className="u-nudge-right--small">
              <Tooltip
                message="MAAS removes workload annotations when the machine is released."
                position="top-center"
              >
                <Icon name="help" />
              </Tooltip>
            </span>
          </div>
          <Link
            external
            href="https://discourse.maas.io/t/machine-workload-annotations/4237"
            onClick={() =>
              sendAnalytics(
                "Machine summary",
                "Click link to workload annotation docs",
                "Read more"
              )
            }
            rel="noopener noreferrer"
            target="_blank"
          >
            Read more
          </Link>
        </div>
        <hr />
        {content}
      </Card>
    </div>
  );
};

export default WorkloadCard;
