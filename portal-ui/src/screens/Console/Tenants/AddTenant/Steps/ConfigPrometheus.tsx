// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, Paper, SelectChangeEvent } from "@mui/material";
import {
  createTenantCommon,
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { isPageValid, updateAddField } from "../../actions";
import { AppState } from "../../../../../store";
import { clearValidationError } from "../../utils";
import {
  commonFormValidation,
  IValidation,
} from "../../../../../utils/validationFunctions";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { ISecurityContext } from "../../types";
import InputUnitMenu from "../../../Common/FormComponents/InputUnitMenu/InputUnitMenu";

interface IConfigureProps {
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  storageClasses: any;
  classes: any;
  prometheusEnabled: boolean;
  prometheusVolumeSize: string;
  prometheusSizeFactor: string;
  prometheusSelectedStorageClass: string;
  prometheusImage: string;
  prometheusSidecarImage: string;
  prometheusInitImage: string;
  selectedStorageClass: string;
  tenantSecurityContext: ISecurityContext;
  prometheusSecurityContext: ISecurityContext;
}

const styles = (theme: Theme) =>
  createStyles({
    configSectionItem: {
      marginRight: 15,

      "& .multiContainer": {
        border: "1px solid red",
      },
    },
    containerItem: {
      marginRight: 15,
    },
    fieldGroup: {
      ...createTenantCommon.fieldGroup,
      paddingTop: 15,
      marginBottom: 25,
    },
    responsiveSectionItem: {
      "@media (max-width: 900px)": {
        flexFlow: "column",
        alignItems: "flex-start",

        "& div > div": {
          marginBottom: 5,
          marginRight: 0,
        },
      },
    },
    fieldSpaceTop: {
      marginTop: 15,
    },
    prometheusEnabledFields: {
      marginLeft: 20, // 2nd Level(15+15)
      padding: 10,
      width: "90%",
      margin: "auto",
    },
    ...modalBasic,
    ...wizardCommon,
  });

const ConfigPrometheus = ({
  classes,
  storageClasses,
  prometheusEnabled,
  prometheusVolumeSize,
  prometheusSizeFactor,
  prometheusSelectedStorageClass,
  prometheusImage,
  prometheusSidecarImage,
  prometheusInitImage,
  updateAddField,
  isPageValid,
  selectedStorageClass,
  tenantSecurityContext,
  prometheusSecurityContext,
}: IConfigureProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});

  const configureSTClasses = [
    { label: "Default", value: "default" },
    ...storageClasses,
  ];

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("configure", field, value);
    },
    [updateAddField]
  );

  // Validation
  useEffect(() => {
    let customAccountValidation: IValidation[] = [];

    if (prometheusEnabled) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "prometheus_storage_class",
          required: true,
          value: prometheusSelectedStorageClass,
          customValidation: prometheusSelectedStorageClass === "",
          customValidationMessage: "Field cannot be empty",
        },
        {
          fieldKey: "prometheus_volume_size",
          required: true,
          value: prometheusVolumeSize,
          customValidation:
            prometheusVolumeSize === "" || parseInt(prometheusVolumeSize) <= 0,
          customValidationMessage: `Volume size must be present and be greater than 0`,
        },
        {
          fieldKey: "prometheus_securityContext_runAsUser",
          required: true,
          value: prometheusSecurityContext.runAsUser,
          customValidation:
            prometheusSecurityContext.runAsUser === "" ||
            parseInt(prometheusSecurityContext.runAsUser) < 0,
          customValidationMessage: `runAsUser must be present and be 0 or more`,
        },
        {
          fieldKey: "prometheus_securityContext_runAsGroup",
          required: true,
          value: prometheusSecurityContext.runAsGroup,
          customValidation:
            prometheusSecurityContext.runAsGroup === "" ||
            parseInt(prometheusSecurityContext.runAsGroup) < 0,
          customValidationMessage: `runAsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "prometheus_securityContext_fsGroup",
          required: true,
          value: prometheusSecurityContext.fsGroup,
          customValidation:
            prometheusSecurityContext.fsGroup === "" ||
            parseInt(prometheusSecurityContext.fsGroup) < 0,
          customValidationMessage: `fsGroup must be present and be 0 or more`,
        },
      ];
    }

    const commonVal = commonFormValidation(customAccountValidation);

    isPageValid("configure", Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [
    prometheusImage,
    prometheusSidecarImage,
    prometheusInitImage,
    isPageValid,
    prometheusEnabled,
    prometheusSelectedStorageClass,
    prometheusVolumeSize,
    tenantSecurityContext,
    prometheusSecurityContext,
  ]);

  useEffect(() => {
    // New default values in current selection is invalid
    if (storageClasses.length > 0) {
      const filterPrometheus = storageClasses.filter(
        (item: any) => item.value === prometheusSelectedStorageClass
      );
      if (filterPrometheus.length === 0) {
        updateField("prometheusSelectedStorageClass", "default");
      }
    }
  }, [
    prometheusSelectedStorageClass,
    selectedStorageClass,
    storageClasses,
    updateField,
  ]);

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Monitoring</h3>
        <span className={classes.descriptionText}>
          A small Prometheus will be deployed to keep metrics about the tenant.
        </span>
      </div>
      <Grid item xs={12} className={classes.configSectionItem}>
        <FormSwitchWrapper
          value="prometheusConfig"
          id="prometheus_configuration"
          name="prometheus_configuration"
          checked={prometheusEnabled}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("prometheusEnabled", checked);
          }}
          label={"Enabled"}
        />
      </Grid>
      {prometheusEnabled && (
        <Grid xs={12} className={classes.prometheusEnabledFields}>
          <Grid item xs={12}>
            <SelectWrapper
              id="prometheus_storage_class"
              name="prometheus_storage_class"
              onChange={(e: SelectChangeEvent<string>) => {
                updateField(
                  "prometheusSelectedStorageClass",
                  e.target.value as string
                );
              }}
              label="Prometheus Storage Class"
              value={prometheusSelectedStorageClass}
              options={configureSTClasses}
              disabled={configureSTClasses.length < 1}
            />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.multiContainer}>
              <InputBoxWrapper
                type="number"
                id="prometheus_volume_size"
                name="prometheus_volume_size"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateField("prometheusVolumeSize", e.target.value);
                  cleanValidation("prometheus_volume_size");
                }}
                label="Storage Size"
                overlayObject={
                  <InputUnitMenu
                    id={"size-unit"}
                    onUnitChange={() => {}}
                    unitSelected={"Gi"}
                    unitsList={[{ label: "Gi", value: "Gi" }]}
                    disabled={true}
                  />
                }
                value={prometheusVolumeSize}
                required
                error={validationErrors["prometheus_volume_size"] || ""}
                min="0"
              />
            </div>
          </Grid>
          <fieldset
            className={`${classes.fieldGroup} ${classes.fieldSpaceTop}`}
          >
            <legend className={classes.descriptionText}>
              SecurityContext for Prometheus
            </legend>
            <Grid item xs={12} className={classes.configSectionItem}>
              <div
                className={`${classes.multiContainer} ${classes.responsiveSectionItem}`}
              >
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="prometheus_securityContext_runAsUser"
                    name="prometheus_securityContext_runAsUser"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("prometheusSecurityContext", {
                        ...prometheusSecurityContext,
                        runAsUser: e.target.value,
                      });
                      cleanValidation("prometheus_securityContext_runAsUser");
                    }}
                    label="Run As User"
                    value={prometheusSecurityContext.runAsUser}
                    required
                    error={
                      validationErrors[
                        "prometheus_securityContext_runAsUser"
                      ] || ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="prometheus_securityContext_runAsGroup"
                    name="prometheus_securityContext_runAsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("prometheusSecurityContext", {
                        ...prometheusSecurityContext,
                        runAsGroup: e.target.value,
                      });
                      cleanValidation("prometheus_securityContext_runAsGroup");
                    }}
                    label="Run As Group"
                    value={prometheusSecurityContext.runAsGroup}
                    required
                    error={
                      validationErrors[
                        "prometheus_securityContext_runAsGroup"
                      ] || ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="prometheus_securityContext_fsGroup"
                    name="prometheus_securityContext_fsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("prometheusSecurityContext", {
                        ...prometheusSecurityContext,
                        fsGroup: e.target.value,
                      });
                      cleanValidation("prometheus_securityContext_fsGroup");
                    }}
                    label="FsGroup"
                    value={prometheusSecurityContext.fsGroup}
                    required
                    error={
                      validationErrors["prometheus_securityContext_fsGroup"] ||
                      ""
                    }
                    min="0"
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} className={classes.configSectionItem}>
              <div
                className={`${classes.multiContainer} ${classes.fieldSpaceTop}`}
              >
                <FormSwitchWrapper
                  value="prometheusSecurityContextRunAsNonRoot"
                  id="prometheus_securityContext_runAsNonRoot"
                  name="prometheus_securityContext_runAsNonRoot"
                  checked={prometheusSecurityContext.runAsNonRoot}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    updateField("prometheusSecurityContext", {
                      ...prometheusSecurityContext,
                      runAsNonRoot: checked,
                    });
                  }}
                  label={"Do not run as Root"}
                />
              </div>
            </Grid>
          </fieldset>
        </Grid>
      )}
    </Paper>
  );
};

const mapState = (state: AppState) => ({
  storageClasses: state.tenants.createTenant.storageClasses,
  prometheusEnabled:
    state.tenants.createTenant.fields.configure.prometheusEnabled,
  prometheusVolumeSize:
    state.tenants.createTenant.fields.configure.prometheusVolumeSize,
  prometheusSizeFactor:
    state.tenants.createTenant.fields.configure.prometheusSizeFactor,
  prometheusSelectedStorageClass:
    state.tenants.createTenant.fields.configure.prometheusSelectedStorageClass,
  prometheusImage: state.tenants.createTenant.fields.configure.prometheusImage,
  prometheusSidecarImage:
    state.tenants.createTenant.fields.configure.prometheusSidecarImage,
  prometheusInitImage:
    state.tenants.createTenant.fields.configure.prometheusInitImage,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
  tenantSecurityContext:
    state.tenants.createTenant.fields.configure.tenantSecurityContext,
  prometheusSecurityContext:
    state.tenants.createTenant.fields.configure.prometheusSecurityContext,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(ConfigPrometheus));
