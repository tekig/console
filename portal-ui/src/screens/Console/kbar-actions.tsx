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

import { Action } from "kbar/lib/types";
import history from "../../history";
import { BucketsIcon } from "../../icons";
import { validRoutes } from "./valid-routes";

export const routesAsKbarActions = (
  features: string[] | null,
  operatorMode: boolean
) => {
  const initialActions: Action[] = [];
  const allowedMenuItems = validRoutes(features, operatorMode);
  for (const i of allowedMenuItems) {
    if (i.children && i.children.length > 0) {
      for (const childI of i.children) {
        const a: Action = {
          id: `${childI.id}`,
          name: childI.name,
          section: i.name,
          perform: () => history.push(`${childI.to}`),
          icon: <childI.icon />,
        };
        initialActions.push(a);
      }
    } else {
      const a: Action = {
        id: `${i.id}`,
        name: i.name,
        section: "Navigation",
        perform: () => history.push(`${i.to}`),
        icon: <i.icon />,
      };
      initialActions.push(a);
    }
  }
  if (!operatorMode) {
    // Add additional actions
    const a: Action = {
      id: `create-bucket`,
      name: "Create Bucket",
      section: "Buckets",
      perform: () => history.push(`/add-bucket`),
      icon: <BucketsIcon />,
    };
    initialActions.push(a);
  }
  return initialActions;
};
