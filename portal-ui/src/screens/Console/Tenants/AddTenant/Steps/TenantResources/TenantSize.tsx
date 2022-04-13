// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { AppState } from "../../../../../../store";
import { isPageValid, updateAddField } from "../../../actions";
import {
  formFieldStyles,
  modalBasic,
  wizardCommon,
} from "../../../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import {
  calculateDistribution,
  erasureCodeCalc,
  getBytes,
  k8sScalarUnitsExcluding,
  niceBytes,
} from "../../../../../../common/utils";
import { clearValidationError } from "../../../utils";
import { ecListTransform, Opts } from "../../../ListTenants/utils";
import { IResourcesSize } from "../../../ListTenants/types";
import { ICapacity, IErasureCodeCalc } from "../../../../../../common/types";
import { commonFormValidation } from "../../../../../../utils/validationFunctions";
import api from "../../../../../../common/api";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import TenantSizeResources from "./TenantSizeResources";
import InputUnitMenu from "../../../../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import { IMkEnvs } from "./utils";

interface ITenantSizeProps {
  classes: any;
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  volumeSize: string;
  sizeFactor: string;
  drivesPerServer: string;
  nodes: string;
  memoryNode: string;
  ecParity: string;
  ecParityChoices: Opts[];
  cleanECChoices: string[];
  resourcesSize: IResourcesSize;
  distribution: any;
  ecParityCalc: IErasureCodeCalc;
  limitSize: any;
  selectedStorageClass: string;
  untouchedECField: boolean;
  formToRender?: IMkEnvs;
  selectedStorageType: string;
}

const styles = (theme: Theme) =>
  createStyles({
    compositeFieldContainer: {
      display: "flex",
      alignItems: "center",
    },
    compositeAddOn: {
      marginLeft: 10,
      "& div": {
        marginBottom: 0,
      },
      "@media (max-width: 900px)": {
        "& div": {
          marginTop: 5,
        },
      },
    },
    ...formFieldStyles,
    ...modalBasic,
    ...wizardCommon,
  });

const TenantSize = ({
  classes,
  updateAddField,
  isPageValid,
  volumeSize,
  sizeFactor,
  drivesPerServer,
  nodes,
  memoryNode,
  ecParity,
  ecParityChoices,
  cleanECChoices,
  resourcesSize,
  distribution,
  ecParityCalc,
  limitSize,
  selectedStorageClass,
  untouchedECField,
  formToRender,
  selectedStorageType,
}: ITenantSizeProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [nodeError, setNodeError] = useState<string>("");

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("tenantSize", field, value);
    },
    [updateAddField]
  );

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  /*Debounce functions*/

  // Storage Quotas
  useEffect(() => {
    if (cleanECChoices.length > 0 && ecParityCalc.defaultEC !== "") {
      updateField(
        "ecParityChoices",
        ecListTransform(cleanECChoices, ecParityCalc.defaultEC)
      );
    }
  }, [ecParityCalc, cleanECChoices, updateField]);

  useEffect(() => {
    if (ecParity !== "" && ecParityCalc.defaultEC !== ecParity) {
      updateField("untouchedECField", false);
      return;
    }

    updateField("untouchedECField", true);
  }, [ecParity, ecParityCalc, updateField]);

  useEffect(() => {
    if (ecParityChoices.length > 0 && distribution.error === "") {
      const ecCodeValidated = erasureCodeCalc(
        cleanECChoices,
        distribution.persistentVolumes,
        distribution.pvSize,
        distribution.nodes
      );

      updateField("ecParityCalc", ecCodeValidated);

      if (!cleanECChoices.includes(ecParity) || ecParity === "") {
        updateField("ecParity", ecCodeValidated.defaultEC);
      }
    }
  }, [
    ecParity,
    ecParityChoices.length,
    distribution,
    cleanECChoices,
    updateField,
    untouchedECField,
  ]);
  /*End debounce functions*/

  /*Calculate Allocation*/
  useEffect(() => {
    //Validate Cluster Size
    const size = volumeSize;
    const factor = sizeFactor;
    const limitSize = getBytes("16", "Ti", true);

    const clusterCapacity: ICapacity = {
      unit: factor,
      value: size.toString(),
    };

    const distrCalculate = calculateDistribution(
      clusterCapacity,
      parseInt(nodes),
      parseInt(limitSize),
      parseInt(drivesPerServer),
      formToRender,
      selectedStorageType
    );

    updateField("distribution", distrCalculate);
    setErrorFlag(false);
    setNodeError("");
  }, [
    nodes,
    volumeSize,
    sizeFactor,
    updateField,
    drivesPerServer,
    selectedStorageType,
    formToRender,
  ]);

  /*Calculate Allocation End*/

  /* Validations of pages */

  useEffect(() => {
    const parsedSize = getBytes(volumeSize, sizeFactor, true);

    const commonValidation = commonFormValidation([
      {
        fieldKey: "nodes",
        required: true,
        value: nodes,
        customValidation: errorFlag,
        customValidationMessage: nodeError,
      },
      {
        fieldKey: "volume_size",
        required: true,
        value: volumeSize,
        customValidation:
          parseInt(parsedSize) < 1073741824 ||
          parseInt(parsedSize) > limitSize[selectedStorageClass],
        customValidationMessage: `Volume size must be greater than 1Gi and less than ${niceBytes(
          limitSize[selectedStorageClass],
          true
        )}`,
      },
      {
        fieldKey: "drivesps",
        required: true,
        value: drivesPerServer,
        customValidation: parseInt(drivesPerServer) < 1,
        customValidationMessage: "There must be at least one drive",
      },
    ]);

    isPageValid(
      "tenantSize",
      !("nodes" in commonValidation) &&
        !("volume_size" in commonValidation) &&
        !("drivesps" in commonValidation) &&
        distribution.error === "" &&
        ecParityCalc.error === 0 &&
        ecParity !== ""
    );

    setValidationErrors(commonValidation);
  }, [
    nodes,
    volumeSize,
    sizeFactor,
    memoryNode,
    distribution,
    ecParityCalc,
    resourcesSize,
    limitSize,
    selectedStorageClass,
    isPageValid,
    errorFlag,
    nodeError,
    drivesPerServer,
    ecParity,
  ]);

  useEffect(() => {
    if (distribution.error === "") {
      // Get EC Value
      if (nodes.trim() !== "" && distribution.disks !== 0) {
        api
          .invoke("GET", `api/v1/get-parity/${nodes}/${distribution.disks}`)
          .then((ecList: string[]) => {
            updateField("ecParityChoices", ecListTransform(ecList));
            updateField("cleanECChoices", ecList);
            if (untouchedECField) {
              updateField("ecParity", "");
            }
          })
          .catch((err: any) => {
            updateField("ecparityChoices", []);
            isPageValid("tenantSize", false);
            updateField("ecParity", "");
          });
      }
    }
  }, [distribution, isPageValid, updateField, nodes, untouchedECField]);

  /* End Validation of pages */

  return (
    <Fragment>
      <Grid item xs={12}>
        <div className={classes.headerElement}>
          <h3 className={classes.h3Section}>Capacity</h3>
          <span className={classes.descriptionText}>
            Please select the desired capacity
          </span>
        </div>
      </Grid>
      {distribution.error !== "" && (
        <Grid item xs={12}>
          <div className={classes.error}>{distribution.error}</div>
        </Grid>
      )}
      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          id="nodes"
          name="nodes"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.validity.valid) {
              updateField("nodes", e.target.value);
              cleanValidation("nodes");
            }
          }}
          label="Number of Servers"
          disabled={selectedStorageClass === ""}
          value={nodes}
          min="4"
          required
          error={validationErrors["nodes"] || ""}
          pattern={"[0-9]*"}
        />
      </Grid>
      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          id="drivesps"
          name="drivesps"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.validity.valid) {
              updateField("drivesPerServer", e.target.value);
              cleanValidation("drivesps");
            }
          }}
          label="Drives per Server"
          value={drivesPerServer}
          disabled={selectedStorageClass === ""}
          min="1"
          required
          error={validationErrors["drivesps"] || ""}
          pattern={"[0-9]*"}
        />
      </Grid>
      <Grid item xs={12}>
        <div className={classes.formFieldRow}>
          <InputBoxWrapper
            type="number"
            id="volume_size"
            name="volume_size"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("volumeSize", e.target.value);
              cleanValidation("volume_size");
            }}
            label="Total Size"
            value={volumeSize}
            disabled={selectedStorageClass === ""}
            required
            error={validationErrors["volume_size"] || ""}
            min="0"
            overlayObject={
              <InputUnitMenu
                id={"size-unit"}
                onUnitChange={(newValue) => {
                  updateField("sizeFactor", newValue);
                }}
                unitSelected={sizeFactor}
                unitsList={k8sScalarUnitsExcluding(["Ki", "Mi"])}
                disabled={selectedStorageClass === ""}
              />
            }
          />
        </div>
      </Grid>

      <Grid item xs={12} className={classes.formFieldRow}>
        <SelectWrapper
          id="ec_parity"
          name="ec_parity"
          onChange={(e: SelectChangeEvent<string>) => {
            updateField("ecParity", e.target.value as string);
          }}
          label="Erasure Code Parity"
          disabled={selectedStorageClass === ""}
          value={ecParity}
          options={ecParityChoices}
        />
        <span className={classes.descriptionText}>
          Please select the desired parity. This setting will change the max
          usable capacity in the cluster
        </span>
      </Grid>

      <TenantSizeResources />
    </Fragment>
  );
};

const mapState = (state: AppState) => {
  const tenantSize = state.tenants.createTenant.fields.tenantSize;
  return {
    volumeSize: tenantSize.volumeSize,
    sizeFactor: tenantSize.sizeFactor,
    drivesPerServer: tenantSize.drivesPerServer,
    nodes: tenantSize.nodes,
    memoryNode: tenantSize.memoryNode,
    ecParity: tenantSize.ecParity,
    ecParityChoices: tenantSize.ecParityChoices,
    cleanECChoices: tenantSize.cleanECChoices,
    resourcesSize: tenantSize.resourcesSize,
    distribution: tenantSize.distribution,
    ecParityCalc: tenantSize.ecParityCalc,
    untouchedECField: tenantSize.untouchedECField,
    limitSize: state.tenants.createTenant.limitSize,
    selectedStorageClass:
      state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
    selectedStorageType:
      state.tenants.createTenant.fields.nameTenant.selectedStorageType,
  };
};

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(TenantSize));
