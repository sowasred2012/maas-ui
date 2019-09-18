import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { formikFormDisabled } from "app/settings/utils";
import ActionButton from "app/base/components/ActionButton";
import Form from "app/base/components/Form";
import ThirdPartyDriversFormFields from "../ThirdPartyDriversFormFields";

const ThirdPartyDriversSchema = Yup.object().shape({
  enable_third_party_drivers: Yup.boolean()
});

const ThirdPartyDriversForm = () => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const thirdPartyDriversEnabled = useSelector(
    configSelectors.thirdPartyDriversEnabled
  );

  return (
    <Formik
      initialValues={{
        enable_third_party_drivers: thirdPartyDriversEnabled
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm(values);
      }}
      validationSchema={ThirdPartyDriversSchema}
      render={formikProps => (
        <Form onSubmit={formikProps.handleSubmit}>
          <ThirdPartyDriversFormFields formikProps={formikProps} />
          <ActionButton
            appearance="positive"
            className="u-no-margin--bottom"
            type="submit"
            disabled={saving || formikFormDisabled(formikProps)}
            loading={saving}
            success={saved}
          >
            Save
          </ActionButton>
        </Form>
      )}
    />
  );
};

export default ThirdPartyDriversForm;