//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
import * as React from "react";
import { KBarProvider } from "kbar";
import Console from "./Console";
import { AppState } from "../../store";
import { connect } from "react-redux";
import CommandBar from "./CommandBar";

const ConsoleKBar = ({
  features,
  operatorMode,
}: {
  operatorMode: boolean;
  features: string[] | null;
}) => {
  // if we are hiding the menu also disable the k-bar so just return console
  if (features?.includes("hide-menu")) {
    return <Console />;
  }

  return (
    <KBarProvider
      options={{
        enableHistory: true,
      }}
    >
      <CommandBar operatorMode={operatorMode} features={features} />
      <Console />
    </KBarProvider>
  );
};

const mapState = (state: AppState) => ({
  operatorMode: state.system.operatorMode,
  features: state.console.session.features,
});

const connector = connect(mapState, null);

export default connector(ConsoleKBar);
