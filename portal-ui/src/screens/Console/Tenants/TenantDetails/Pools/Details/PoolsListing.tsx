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

import React, { Fragment, useEffect, useState } from "react";
import withStyles from "@mui/styles/withStyles";
import { AppState } from "../../../../../../store";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../../../../actions";
import { setSelectedPool } from "../../../actions";
import { IPool, ITenant } from "../../../ListTenants/types";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "../../../../../../icons/SearchIcon";
import RBIconButton from "../../../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import { AddIcon } from "../../../../../../icons";
import TableWrapper from "../../../../Common/TableWrapper/TableWrapper";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {
  actionsTray,
  containerForHeader,
  tableStyles,
  tenantDetailsStyles,
} from "../../../../Common/FormComponents/common/styleLibrary";

interface IPoolsSummary {
  classes: any;
  tenant: ITenant | null;
  loadingTenant: boolean;
  history: any;
  setPoolDetailsView: () => void;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSelectedPool: typeof setSelectedPool;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    ...actionsTray,
    ...tableStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const PoolsListing = ({
  classes,
  tenant,
  loadingTenant,
  setSelectedPool,
  history,
  setPoolDetailsView,
}: IPoolsSummary) => {
  const [pools, setPools] = useState<IPool[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (tenant) {
      const resPools = !tenant.pools ? [] : tenant.pools;
      setPools(resPools);
    }
  }, [tenant]);

  const filteredPools = pools.filter((pool) => {
    if (pool.name.toLowerCase().includes(filter.toLowerCase())) {
      return true;
    }

    return false;
  });

  const listActions = [
    {
      type: "view",
      onClick: (selectedValue: IPool) => {
        setSelectedPool(selectedValue.name);
        setPoolDetailsView();
      },
    },
  ];

  return (
    <Fragment>
      <Grid item xs={12} className={classes.actionsTray}>
        <TextField
          placeholder="Filter"
          className={classes.searchField}
          id="search-resource"
          label=""
          onChange={(event) => {
            setFilter(event.target.value);
          }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />

        <RBIconButton
          tooltip={"Expand Tenant"}
          text={"Expand Tenant"}
          onClick={() => {
            history.push(
              `/namespaces/${tenant?.namespace || ""}/tenants/${
                tenant?.name || ""
              }/add-pool`
            );
          }}
          icon={<AddIcon />}
          color="primary"
          variant={"contained"}
        />
      </Grid>
      <Grid item xs={12} className={classes.tableBlock}>
        <TableWrapper
          itemActions={listActions}
          columns={[
            { label: "Name", elementKey: "name" },
            { label: "Capacity", elementKey: "capacity" },
            { label: "# of Instances", elementKey: "servers" },
            { label: "# of Drives", elementKey: "volumes" },
          ]}
          isLoading={loadingTenant}
          records={filteredPools}
          entityName="Servers"
          idField="name"
          customEmptyMessage="No Pools found"
        />
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setSelectedPool,
});

export default withStyles(styles)(connector(PoolsListing));
