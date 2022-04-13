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

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { withRouter } from "react-router-dom";
import Grid from "@mui/material/Grid";
import get from "lodash/get";
import {
  BucketObject,
  BucketObjectsList,
  RewindObject,
  RewindObjectList,
} from "./types";
import api from "../../../../../../common/api";
import TableWrapper, {
  ItemActions,
} from "../../../../Common/TableWrapper/TableWrapper";
import {
  decodeFileName,
  encodeFileName,
  niceBytesInt,
} from "../../../../../../common/utils";

import {
  actionsTray,
  containerForHeader,
  objectBrowserCommon,
  objectBrowserExtras,
  searchField,
  tableStyles,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { Badge, Typography } from "@mui/material";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import {
  completeObject,
  openList,
  resetRewind,
  setLoadingVersions,
  setNewObject,
  setSearchObjects,
  setShowDeletedObjects,
  setVersionsModeEnabled,
  updateProgress,
} from "../../../../ObjectBrowser/actions";
import { Route } from "../../../../ObjectBrowser/reducers";

import { download, extensionPreview, sortListObjects } from "../utils";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../../../actions";
import {
  BucketInfo,
  BucketObjectLocking,
  BucketQuota,
  BucketVersioning,
} from "../../../types";
import { ErrorResponseHandler } from "../../../../../../common/types";

import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";

import { setBucketDetailsLoad, setBucketInfo } from "../../../actions";
import { AppState } from "../../../../../../store";
import PageLayout from "../../../../Common/Layout/PageLayout";

import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import {
  SecureComponent,
  hasPermission,
} from "../../../../../../common/SecureComponent";

import withSuspense from "../../../../Common/Components/withSuspense";
import {
  BucketsIcon,
  DownloadIcon,
  PreviewIcon,
  ShareIcon,
} from "../../../../../../icons";
import UploadFilesButton from "../../UploadFilesButton";
import DetailsListPanel from "./DetailsListPanel";
import ObjectDetailPanel from "./ObjectDetailPanel";
import RBIconButton from "../../../BucketDetails/SummaryItems/RBIconButton";
import ActionsListSection from "./ActionsListSection";
import { listModeColumns, rewindModeColumns } from "./ListObjectsHelpers";
import VersionsNavigator from "../ObjectDetails/VersionsNavigator";
import CheckboxWrapper from "../../../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

const HistoryIcon = React.lazy(
  () => import("../../../../../../icons/HistoryIcon")
);
const RefreshIcon = React.lazy(
  () => import("../../../../../../icons/RefreshIcon")
);

const DeleteIcon = React.lazy(
  () => import("../../../../../../icons/DeleteIcon")
);

const DeleteMultipleObjects = withSuspense(
  React.lazy(() => import("./DeleteMultipleObjects"))
);
const ShareFile = withSuspense(
  React.lazy(() => import("../ObjectDetails/ShareFile"))
);
const RewindEnable = withSuspense(React.lazy(() => import("./RewindEnable")));
const PreviewFileModal = withSuspense(
  React.lazy(() => import("../Preview/PreviewFileModal"))
);

const styles = (theme: Theme) =>
  createStyles({
    browsePaper: {
      border: 0,
      height: "calc(100vh - 210px)",
      "&.actionsPanelOpen": {
        minHeight: "100%",
      },
    },
    "@global": {
      ".rowLine:hover  .iconFileElm": {
        backgroundImage: "url(/images/ob_file_filled.svg)",
      },
      ".rowLine:hover  .iconFolderElm": {
        backgroundImage: "url(/images/ob_folder_filled.svg)",
      },
    },

    badgeOverlap: {
      "& .MuiBadge-badge": {
        top: 10,
        right: 1,
        width: 5,
        height: 5,
        minWidth: 5,
      },
    },
    screenTitle: {
      borderBottom: 0,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    ...tableStyles,
    ...actionsTray,
    ...searchField,

    searchField: {
      ...searchField.searchField,
      maxWidth: 380,
    },
    screenTitleContainer: {
      border: "#EAEDEE 1px solid",
      padding: "0.8rem 15px 0",
    },
    labelStyle: {
      color: "#969FA8",
      fontSize: "12px",
    },
    breadcrumbsContainer: {
      padding: "12px 14px 5px",
    },
    ...objectBrowserExtras,
    ...objectBrowserCommon,
    ...containerForHeader(theme.spacing(4)),
  });

const baseDnDStyle = {
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  outline: "none",
};

const activeDnDStyle = {
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  borderColor: "#2196f3",
};

const acceptDnDStyle = {
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  borderColor: "#00e676",
};

interface IListObjectsProps {
  classes: any;
  match: any;
  history: any;
  routesList: Route[];
  downloadingFiles: string[];
  rewindEnabled: boolean;
  rewindDate: any;
  bucketToRewind: string;
  searchObjects: string;
  showDeleted: boolean;
  setSnackBarMessage: typeof setSnackBarMessage;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  resetRewind: typeof resetRewind;
  loadingBucket: boolean;
  setBucketInfo: typeof setBucketInfo;
  bucketInfo: BucketInfo | null;
  versionsMode: boolean;
  setBucketDetailsLoad: typeof setBucketDetailsLoad;
  setNewObject: typeof setNewObject;
  updateProgress: typeof updateProgress;
  completeObject: typeof completeObject;
  openList: typeof openList;
  setSearchObjects: typeof setSearchObjects;
  setVersionsModeEnabled: typeof setVersionsModeEnabled;
  setShowDeletedObjects: typeof setShowDeletedObjects;
  setLoadingVersions: typeof setLoadingVersions;
}

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef<Function | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback !== undefined && savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const defLoading = <Typography component="h3">Loading...</Typography>;

const ListObjects = ({
  classes,
  match,
  history,
  rewindEnabled,
  rewindDate,
  bucketToRewind,
  setSnackBarMessage,
  setErrorSnackMessage,
  resetRewind,
  setBucketDetailsLoad,
  loadingBucket,
  setBucketInfo,
  bucketInfo,
  setNewObject,
  updateProgress,
  completeObject,
  setSearchObjects,
  searchObjects,
  versionsMode,
  openList,
  setVersionsModeEnabled,
  showDeleted,
  setShowDeletedObjects,
  setLoadingVersions,
}: IListObjectsProps) => {
  const [records, setRecords] = useState<BucketObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rewind, setRewind] = useState<RewindObject[]>([]);
  const [loadingRewind, setLoadingRewind] = useState<boolean>(false);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] =
    useState<React.ReactNode>(defLoading);
  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);
  const [isVersioned, setIsVersioned] = useState<boolean>(false);
  const [loadingLocking, setLoadingLocking] = useState<boolean>(true);
  const [lockingEnabled, setLockingEnabled] = useState<boolean>(false);
  const [rewindSelect, setRewindSelect] = useState<boolean>(false);
  const [selectedMainObject, setSelectedMainObject] = useState<string|null>(null);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [selectedPreview, setSelectedPreview] = useState<BucketObject | null>(
    null
  );
  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [sortDirection, setSortDirection] = useState<
    "ASC" | "DESC" | undefined
  >("ASC");
  const [currentSortField, setCurrentSortField] = useState<string>("name");
  const [iniLoad, setIniLoad] = useState<boolean>(false);
  const [canShareFile, setCanShareFile] = useState<boolean>(false);
  const [canPreviewFile, setCanPreviewFile] = useState<boolean>(false);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [selectedInternalPaths, setSelectedInternalPaths] = useState<
    string | null
  >(null);
  const [quota, setQuota] = useState<BucketQuota | null>(null);

  const internalPaths = get(match.params, "subpaths", "");
  const bucketName = match.params["bucketName"];

  const fileUpload = useRef<HTMLInputElement>(null);
  const folderUpload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (folderUpload.current !== null) {
      folderUpload.current.setAttribute("directory", "");
      folderUpload.current.setAttribute("webkitdirectory", "");
    }
  }, [folderUpload]);

  useEffect(() => {
    if (selectedObjects.length === 1) {
      const objectName = selectedObjects[0];

      if (extensionPreview(objectName) !== "none") {
        setCanPreviewFile(true);
      } else {
        setCanPreviewFile(false);
      }

      if (objectName.endsWith("/")) {
        setCanShareFile(false);
      } else {
        setCanShareFile(true);
      }
    } else {
      setCanShareFile(false);
      setCanPreviewFile(false);
    }
  }, [selectedObjects]);

  useEffect(() => {
    if (!quota) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/quota`)
        .then((res: BucketQuota) => {
          let quotaVals = null;

          if (res.quota) {
            quotaVals = res;
          }

          setQuota(quotaVals);
        })
        .catch(() => {
          setQuota(null);
        });
    }
  }, [quota, bucketName]);

  useEffect(() => {
    if (selectedObjects.length > 0) {
      setDetailsOpen(true);
      return;
    }

    if (selectedObjects.length === 0 && selectedInternalPaths === null) {
      setDetailsOpen(false);
    }
  }, [selectedObjects, selectedInternalPaths]);

  const displayDeleteObject = hasPermission(bucketName, [
    IAM_SCOPES.S3_DELETE_OBJECT,
  ]);

  const displayListObjects = hasPermission(bucketName, [
    IAM_SCOPES.S3_LIST_BUCKET,
  ]);

  const updateMessage = () => {
    let timeDelta = Date.now() - loadingStartTime;

    if (timeDelta / 1000 >= 6) {
      setLoadingMessage(
        <Fragment>
          <Typography component="h3">
            This operation is taking longer than expected... (
            {Math.ceil(timeDelta / 1000)}s)
          </Typography>
        </Fragment>
      );
    } else if (timeDelta / 1000 >= 3) {
      setLoadingMessage(
        <Typography component="h3">
          This operation is taking longer than expected...
        </Typography>
      );
    }
  };

  useEffect(() => {
    if (!iniLoad) {
      setBucketDetailsLoad(true);
      setIniLoad(true);
    }
  }, [iniLoad, setBucketDetailsLoad, setIniLoad]);

  useInterval(() => {
    // Your custom logic here
    if (loading) {
      updateMessage();
    }
  }, 1000);

  useEffect(() => {
    if (loadingVersioning) {
      if (displayListObjects) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/versioning`)
          .then((res: BucketVersioning) => {
            setIsVersioned(res.is_versioned);
            setLoadingVersioning(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
            setLoadingVersioning(false);
          });
      } else {
        setLoadingVersioning(false);
      }
    }
  }, [bucketName, loadingVersioning, setErrorSnackMessage, displayListObjects]);

  useEffect(() => {
    if (loadingLocking) {
      if (displayListObjects) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/object-locking`)
          .then((res: BucketObjectLocking) => {
            setLockingEnabled(res.object_locking_enabled);
            setLoadingLocking(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
            setLoadingLocking(false);
          });
      } else {
        setLoadingLocking(false);
      }
    }
  }, [bucketName, loadingLocking, setErrorSnackMessage, displayListObjects]);

  // Rewind
  useEffect(() => {
    if (rewindEnabled) {
      if (bucketToRewind !== bucketName) {
        resetRewind();
        return;
      }

      if (rewindDate) {
        setLoadingRewind(true);
        const rewindParsed = rewindDate.toISOString();
        let pathPrefix = "";
        if (internalPaths) {
          const decodedPath = decodeFileName(internalPaths);
          pathPrefix = decodedPath.endsWith("/")
            ? decodedPath
            : decodedPath + "/";
        }
        api
          .invoke(
            "GET",
            `/api/v1/buckets/${bucketName}/rewind/${rewindParsed}${
              pathPrefix ? `?prefix=${encodeFileName(pathPrefix)}` : ``
            }`
          )
          .then((res: RewindObjectList) => {
            setLoadingRewind(false);
            if (res.objects) {
              // We omit files from the same path
              const filteredObjects = res.objects.filter((object) => {
                return object.name !== decodeFileName(internalPaths);
              });

              setRewind(filteredObjects);
            } else {
              setRewind([]);
            }
          })
          .catch((err: ErrorResponseHandler) => {
            setLoadingRewind(false);
            setErrorSnackMessage(err);
          });
      }
    }
  }, [
    rewindEnabled,
    rewindDate,
    bucketToRewind,
    bucketName,
    match,
    setErrorSnackMessage,
    resetRewind,
    internalPaths,
  ]);

  useEffect(() => {
    setLoading(true);
    setDetailsOpen(false);
    setSearchObjects("");
  }, [internalPaths, setSearchObjects]);

  useEffect(() => {
    if (loading) {
      if (displayListObjects) {
        let pathPrefix = "";
        if (internalPaths) {
          const decodedPath = decodeFileName(internalPaths);
          pathPrefix = decodedPath.endsWith("/")
            ? decodedPath
            : decodedPath + "/";
        }

        let currentTimestamp = Date.now();
        setLoadingStartTime(currentTimestamp);
        setLoadingMessage(defLoading);

        let urlTake = `/api/v1/buckets/${bucketName}/objects`;

        if (showDeleted) {
          const currDate = new Date();
          const currDateISO = currDate.toISOString();

          urlTake = `/api/v1/buckets/${bucketName}/rewind/${currDateISO}`;
        }

        api
          .invoke(
            "GET",
            `${urlTake}${
              pathPrefix ? `?prefix=${encodeFileName(pathPrefix)}` : ``
            }`
          )
          .then((res: BucketObjectsList) => {
            const records: BucketObject[] = res.objects || [];
            const folders: BucketObject[] = [];
            const files: BucketObject[] = [];

            records.forEach((record) => {
              // We omit files from the same path
              if (record.name !== decodeFileName(internalPaths)) {
                // this is a folder
                if (record.name.endsWith("/")) {
                  folders.push(record);
                } else {
                  // this is a file
                  files.push(record);
                }
              }
            });
            const recordsInElement = [...folders, ...files];
            setRecords(recordsInElement);
            // In case no objects were retrieved, We check if item is a file
            if (!res.objects && pathPrefix !== "") {
              if (rewindEnabled) {
                const rewindParsed = rewindDate.toISOString();

                let pathPrefix = "";
                if (internalPaths) {
                  const decodedPath = decodeFileName(internalPaths);
                  pathPrefix = decodedPath.endsWith("/")
                    ? decodedPath
                    : decodedPath + "/";
                }
                api
                  .invoke(
                    "GET",
                    `/api/v1/buckets/${bucketName}/rewind/${rewindParsed}${
                      pathPrefix ? `?prefix=${encodeFileName(pathPrefix)}` : ``
                    }`
                  )
                  .then((res: RewindObjectList) => {
                    //It is a file since it has elements in the object, setting file flag and waiting for component mount
                    if (res.objects === null) {
                      //setFileModeEnabled(true);
                      setLoadingRewind(false);
                      setLoading(false);
                    } else {
                      // It is a folder, we remove loader
                      setLoadingRewind(false);
                      setLoading(false);
                      //setFileModeEnabled(false);
                    }
                  })
                  .catch((err: ErrorResponseHandler) => {
                    setLoadingRewind(false);
                    setLoading(false);
                    setErrorSnackMessage(err);
                  });
              } else {
                api
                  .invoke(
                    "GET",
                    `/api/v1/buckets/${bucketName}/objects${
                      internalPaths ? `?prefix=${internalPaths}` : ``
                    }`
                  )
                  .then((res: BucketObjectsList) => {
                    //It is a file since it has elements in the object, setting file flag and waiting for component mount
                    if (!res.objects) {
                      // It is a folder, we remove loader
                      //setFileModeEnabled(false);
                      setLoading(false);
                    } else {
                      // This code prevents the program from opening a file when a substring of that file is entered as a new folder.
                      // Previously, if there was a file test1.txt and the folder test was created with the same prefix, the program
                      // would open test1.txt instead
                      let found = false;
                      let pathPrefixChopped = pathPrefix.slice(
                        0,
                        pathPrefix.length - 1
                      );
                      for (let i = 0; i < res.objects.length; i++) {
                        if (res.objects[i].name === pathPrefixChopped) {
                          found = true;
                        }
                      }
                      if (
                        (res.objects.length === 1 &&
                          res.objects[0].name.endsWith("/")) ||
                        !found
                      ) {
                        //setFileModeEnabled(false);
                      } else {
                        //setFileModeEnabled(true);
                      }

                      setLoading(false);
                    }
                  })
                  .catch((err: ErrorResponseHandler) => {
                    setLoading(false);
                    setErrorSnackMessage(err);
                  });
              }
            } else {
              //setFileModeEnabled(false);
              setLoading(false);
            }
          })
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            setErrorSnackMessage(err);
          });
      } else {
        setLoadingRewind(false);
        setLoading(false);
      }
    }
  }, [
    loading,
    match,
    setErrorSnackMessage,
    bucketName,
    rewindEnabled,
    rewindDate,
    internalPaths,
    bucketInfo,
    showDeleted,
    displayListObjects,
  ]);

  // bucket info
  useEffect(() => {
    if (loadingBucket) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}`)
        .then((res: BucketInfo) => {
          setBucketDetailsLoad(false);
          setBucketInfo(res);
        })
        .catch((err: ErrorResponseHandler) => {
          setBucketDetailsLoad(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    bucketName,
    loadingBucket,
    setBucketDetailsLoad,
    setBucketInfo,
    setErrorSnackMessage,
  ]);

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    setDeleteMultipleOpen(false);

    if (refresh) {
      setSnackBarMessage(`Objects deleted successfully.`);
      setSelectedObjects([]);
      setSelectedMainObject(null);
      setLoading(true);
    }
  };

  const handleUploadButton = (e: any) => {
    if (
      e === null ||
      e === undefined ||
      e.target.files === null ||
      e.target.files === undefined
    ) {
      return;
    }
    e.preventDefault();
    var newFiles: File[] = [];

    for (var i = 0; i < e.target.files.length; i++) {
      newFiles.push(e.target.files[i]);
    }
    uploadObject(newFiles, "");

    e.target.value = "";
  };

  const downloadObject = (object: BucketObject | RewindObject) => {
    const identityDownload = encodeFileName(
      `${bucketName}-${object.name}-${new Date().getTime()}-${Math.random()}`
    );

    setNewObject({
      bucketName,
      done: false,
      instanceID: identityDownload,
      percentage: 0,
      prefix: object.name,
      type: "download",
      waitingForFile: true,
    });

    download(
      bucketName,
      encodeFileName(object.name),
      object.version_id,
      object.size,
      (progress) => {
        updateProgress(identityDownload, progress);
      },
      () => {
        completeObject(identityDownload);
      }
    );
  };

  const openPath = (idElement: string) => {
    setSelectedObjects([]);
    if (idElement.endsWith("/")) {
      const newPath = `/buckets/${bucketName}/browse${
        idElement ? `/${encodeFileName(idElement)}` : ``
      }`;
      history.push(newPath);
      return;
    }

    setDetailsOpen(true);
    setLoadingVersions(true);
    setSelectedInternalPaths(
      `${idElement ? `${encodeFileName(idElement)}` : ``}`
    );
  };

  const uploadObject = useCallback(
    (files: File[], folderPath: string): void => {
      let pathPrefix = "";
      if (internalPaths) {
        const decodedPath = decodeFileName(internalPaths);
        pathPrefix = decodedPath.endsWith("/")
          ? decodedPath
          : decodedPath + "/";
      }

      const upload = (
        files: File[],
        bucketName: string,
        path: string,
        folderPath: string
      ) => {
        let uploadPromise = (file: File) => {
          return new Promise((resolve, reject) => {
            let uploadUrl = `api/v1/buckets/${bucketName}/objects/upload`;
            const fileName = file.name;
            const blobFile = new Blob([file], { type: file.type });

            let encodedPath = "";
            const relativeFolderPath =
              get(file, "webkitRelativePath", "") !== ""
                ? get(file, "webkitRelativePath", "")
                : folderPath;

            if (path !== "" || relativeFolderPath !== "") {
              const finalFolderPath = relativeFolderPath
                .split("/")
                .slice(0, -1)
                .join("/");

              encodedPath = encodeFileName(
                `${path}${finalFolderPath}${
                  !finalFolderPath.endsWith("/") ? "/" : ""
                }`
              );
            }

            if (encodedPath !== "") {
              uploadUrl = `${uploadUrl}?prefix=${encodedPath}`;
            }

            const identity = encodeFileName(
              `${bucketName}-${encodedPath}-${new Date().getTime()}-${Math.random()}`
            );

            setNewObject({
              bucketName,
              done: false,
              instanceID: identity,
              percentage: 0,
              prefix: `${decodeFileName(encodedPath)}${fileName}`,
              type: "upload",
              waitingForFile: false,
            });

            let xhr = new XMLHttpRequest();
            xhr.open("POST", uploadUrl, true);

            const areMultipleFiles = files.length > 1;
            let errorMessage = `An error occurred while uploading the file${
              areMultipleFiles ? "s" : ""
            }.`;

            const errorMessages: any = {
              413: "Error - File size too large",
            };

            xhr.withCredentials = false;
            xhr.onload = function (event) {
              // resolve promise only when HTTP code is ok
              if (xhr.status >= 200 && xhr.status < 300) {
                completeObject(identity);
                resolve({ status: xhr.status });
              } else {
                // reject promise if there was a server error
                if (errorMessages[xhr.status]) {
                  errorMessage = errorMessages[xhr.status];
                } else if (xhr.response) {
                  try {
                    const err = JSON.parse(xhr.response);
                    errorMessage = err.detailedMessage;
                  } catch (e) {
                    errorMessage = "something went wrong";
                  }
                }
                reject({ status: xhr.status, message: errorMessage });
              }
            };

            xhr.upload.addEventListener("error", (event) => {
              reject(errorMessage);
              return;
            });

            xhr.upload.addEventListener("progress", (event) => {
              const progress = Math.floor((event.loaded * 100) / event.total);

              updateProgress(identity, progress);
            });

            xhr.onerror = () => {
              reject(errorMessage);
              return;
            };
            xhr.onloadend = () => {
              if (files.length === 0) {
                setLoading(true);
              }
            };

            const formData = new FormData();
            if (file.size !== undefined) {
              formData.append(file.size.toString(), blobFile, fileName);
              xhr.send(formData);
            }
          });
        };

        const uploadFilePromises: any = [];
        // open object manager
        openList();
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          uploadFilePromises.push(uploadPromise(file));
        }
        Promise.allSettled(uploadFilePromises).then((results: Array<any>) => {
          const errors = results.filter(
            (result) => result.status === "rejected"
          );
          if (errors.length > 0) {
            const totalFiles = uploadFilePromises.length;
            const successUploadedFiles =
              uploadFilePromises.length - errors.length;
            const err: ErrorResponseHandler = {
              errorMessage: "There were some errors during file upload",
              detailedError: `Uploaded files ${successUploadedFiles}/${totalFiles}`,
            };
            console.log("upload results", results);
            setErrorSnackMessage(err);
          }
        });
      };

      upload(files, bucketName, pathPrefix, folderPath);
    },
    [
      bucketName,
      completeObject,
      internalPaths,
      openList,
      setNewObject,
      setErrorSnackMessage,
      updateProgress,
    ]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        let newFolderPath: string = acceptedFiles[0].path;
        uploadObject(acceptedFiles, newFolderPath);
      }
    },
    [uploadObject]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept } =
    useDropzone({
      noClick: true,
      onDrop,
    });

  const dndStyles = useMemo(
    () => ({
      ...baseDnDStyle,
      ...(isDragActive ? activeDnDStyle : {}),
      ...(isDragAccept ? acceptDnDStyle : {}),
    }),
    [isDragActive, isDragAccept]
  );

  const openPreview = () => {
    if (selectedObjects.length === 1) {
      let fileObject: BucketObject | undefined;

      const findFunction = (currValue: BucketObject | RewindObject) =>
        selectedObjects.includes(currValue.name);

      fileObject = filteredRecords.find(findFunction);

      if (fileObject) {
        setSelectedPreview(fileObject);
        setPreviewOpen(true);
      }
    }
  };

  const openShare = () => {
    if (selectedObjects.length === 1) {
      let fileObject: BucketObject | undefined;

      const findFunction = (currValue: BucketObject | RewindObject) =>
        selectedObjects.includes(currValue.name);

      fileObject = filteredRecords.find(findFunction);

      if (fileObject) {
        setSelectedPreview(fileObject);
        setShareFileModalOpen(true);
      }
    }
  };

  const closeShareModal = () => {
    setShareFileModalOpen(false);
    setSelectedPreview(null);
  };

  const filteredRecords = records.filter((b: BucketObject) => {
    if (searchObjects === "") {
      return true;
    } else {
      const objectName = b.name.toLowerCase();
      if (objectName.indexOf(searchObjects.toLowerCase()) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  });

  const rewindCloseModal = (refresh: boolean) => {
    setRewindSelect(false);
  };

  const closePreviewWindow = () => {
    setPreviewOpen(false);
    setSelectedPreview(null);
  };

  const sortChange = (sortData: any) => {
    const newSortDirection = get(sortData, "sortDirection", "DESC");
    setCurrentSortField(sortData.sortBy);
    setSortDirection(newSortDirection);
    setLoading(true);
  };

  const pageTitle = decodeFileName(internalPaths);
  const currentPath = pageTitle.split("/").filter((i: string) => i !== "");

  const plSelect = rewindEnabled ? rewind : filteredRecords;
  const sortASC = plSelect.sort(sortListObjects(currentSortField));

  let payload: BucketObject[] | RewindObject[] = [];

  if (sortDirection === "ASC") {
    payload = sortASC;
  } else {
    payload = sortASC.reverse();
  }

  const selectListObjects = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    let checked = targetD.checked;
    // @ts-ignore shiftKey is defined for click events
    const shift: bool = e.nativeEvent.shiftKey;
    // @ts-ignore ctrlKey is defined for click events
    const ctrl: bool = e.nativeEvent.ctrlKey;
    let elements: string[] = ctrl ? [...selectedObjects] : []; // We clone the selectedBuckets array

    let mainObject = value;
    // Use the shift effect if different elements are selected
    if (shift && selectedMainObject !== null) {
      // Repeat the previous steps for everyone in the range
      mainObject = selectedMainObject;
      checked = elements.indexOf(mainObject) !== -1 || (shift && !ctrl);
    } else {
      setSelectedMainObject(value);
    }

    const [min, max] = [
      payload.findIndex(object => object.name === value),
      payload.findIndex(object => object.name === mainObject),
    ].sort((a, b) => a - b); // correctly sort an array of numbers
    for (let i = min; i <= max; i++) {
      const current = payload[i].name;
      if (checked) {
        // If the user has checked this field we need to push this to selectedBucketsList
        if (elements.indexOf(current) === -1) {
          elements.push(current);
        }
      } else {
        // User has unchecked this field, we need to remove it from the list
        elements = elements.filter((element) => element !== current);
      }
    }
       
    setSelectedObjects(elements);
    setSelectedInternalPaths(null);

    return elements;
  };

  const selectAllItems = () => {
    setSelectedInternalPaths(null);

    if (selectedObjects.length === payload.length) {
      setSelectedObjects([]);
      return;
    }

    const elements = payload.map((item) => item.name);
    setSelectedObjects(elements);
  };

  const downloadSelected = () => {
    if (selectedObjects.length !== 0) {
      let itemsToDownload: BucketObject[] | RewindObject[] = [];

      const filterFunction = (currValue: BucketObject | RewindObject) =>
        selectedObjects.includes(currValue.name);

      if (rewindEnabled) {
        itemsToDownload = rewind.filter(filterFunction);
      } else {
        itemsToDownload = filteredRecords.filter(filterFunction);
      }

      itemsToDownload.forEach((filteredItem) => {
        downloadObject(filteredItem);
      });
    }
  };
  let uploadPath = [bucketName];
  if (currentPath.length > 0) {
    uploadPath = uploadPath.concat(currentPath);
  }

  const onClosePanel = (forceRefresh: boolean) => {
    setDetailsOpen(false);
    setSelectedInternalPaths(null);
    setSelectedObjects([]);
    setVersionsModeEnabled(false);

    if (forceRefresh) {
      setLoading(true);
    }
  };

  const setDeletedAction = () => {
    setShowDeletedObjects(!showDeleted);
    onClosePanel(true);
  };

  const tableActions: ItemActions[] = [
    {
      type: "view",
      label: "View",
      onClick: openPath,
      sendOnlyId: true,
    },
  ];

  const multiActionButtons = [
    {
      action: downloadSelected,
      label: "Download",
      disabled: selectedObjects.length === 0,
      icon: <DownloadIcon />,
      tooltip: "Download Selected",
    },
    {
      action: openShare,
      label: "Share",
      disabled: selectedObjects.length !== 1 || !canShareFile,
      icon: <ShareIcon />,
      tooltip: "Share Selected File",
    },
    {
      action: openPreview,
      label: "Preview",
      disabled: selectedObjects.length !== 1 || !canPreviewFile,
      icon: <PreviewIcon />,
      tooltip: "Preview Selected File",
    },
    {
      action: () => {
        setDeleteMultipleOpen(true);
      },
      label: "Delete",
      icon: <DeleteIcon />,
      disabled:
        !hasPermission(bucketName, [IAM_SCOPES.S3_DELETE_OBJECT]) ||
        selectedObjects.length === 0 ||
        !displayDeleteObject,
      tooltip: "Delete Selected Files",
    },
  ];

  return (
    <Fragment>
      {shareFileModalOpen && selectedPreview && (
        <ShareFile
          open={shareFileModalOpen}
          closeModalAndRefresh={closeShareModal}
          bucketName={bucketName}
          dataObject={{
            name: selectedPreview.name,
            last_modified: "",
            version_id: selectedPreview.version_id,
          }}
        />
      )}
      {deleteMultipleOpen && (
        <DeleteMultipleObjects
          deleteOpen={deleteMultipleOpen}
          selectedBucket={bucketName}
          selectedObjects={selectedObjects}
          closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
          versioning={isVersioned}
        />
      )}
      {rewindSelect && (
        <RewindEnable
          open={rewindSelect}
          closeModalAndRefresh={rewindCloseModal}
          bucketName={bucketName}
        />
      )}
      {previewOpen && (
        <PreviewFileModal
          open={previewOpen}
          bucketName={bucketName}
          object={selectedPreview}
          onClosePreview={closePreviewWindow}
        />
      )}
      <PageLayout>
        <Grid item xs={12} className={classes.screenTitleContainer}>
          <ScreenTitle
            className={classes.screenTitle}
            icon={
              <span className={classes.listIcon}>
                <BucketsIcon />
              </span>
            }
            title={<span className={classes.titleSpacer}>{bucketName}</span>}
            subTitle={
              <Fragment>
                <Grid item xs={12} className={classes.bucketDetails}>
                  <span className={classes.detailsSpacer}>
                    Created:&nbsp;&nbsp;&nbsp;
                    <strong>{bucketInfo?.creation_date || ""}</strong>
                  </span>
                  <span className={classes.detailsSpacer}>
                    Access:&nbsp;&nbsp;&nbsp;
                    <strong>{bucketInfo?.access || ""}</strong>
                  </span>
                  {bucketInfo && (
                    <Fragment>
                      <span className={classes.detailsSpacer}>
                        {bucketInfo.size && (
                          <Fragment>{niceBytesInt(bucketInfo.size)}</Fragment>
                        )}
                        {bucketInfo.size && quota && (
                          <Fragment> / {niceBytesInt(quota.quota)}</Fragment>
                        )}
                        {bucketInfo.size && bucketInfo.objects ? " - " : ""}
                        {bucketInfo.objects && (
                          <Fragment>
                            {bucketInfo.objects}&nbsp;Object
                            {bucketInfo.objects && bucketInfo.objects !== 1
                              ? "s"
                              : ""}
                          </Fragment>
                        )}
                      </span>
                    </Fragment>
                  )}
                </Grid>
              </Fragment>
            }
            actions={
              <Fragment>
                <RBIconButton
                  id={"rewind-objects-list"}
                  tooltip={"Rewind Bucket"}
                  text={"Rewind"}
                  icon={
                    <Badge
                      badgeContent=" "
                      color="secondary"
                      variant="dot"
                      invisible={!rewindEnabled}
                      className={classes.badgeOverlap}
                      sx={{ height: 12 }}
                    >
                      <HistoryIcon />
                    </Badge>
                  }
                  color="primary"
                  variant={"outlined"}
                  onClick={() => {
                    setRewindSelect(true);
                  }}
                  disabled={
                    !isVersioned ||
                    !hasPermission(bucketName, [IAM_SCOPES.S3_PUT_OBJECT])
                  }
                />
                <RBIconButton
                  id={"refresh-objects-list"}
                  tooltip={"Reload List"}
                  text={"Refresh"}
                  icon={<RefreshIcon />}
                  color="primary"
                  variant={"outlined"}
                  onClick={() => {
                    if (versionsMode) {
                      setLoadingVersions(true);
                    } else {
                      setLoading(true);
                    }
                  }}
                  disabled={
                    !hasPermission(bucketName, [IAM_SCOPES.S3_LIST_BUCKET]) ||
                    rewindEnabled
                  }
                />
                <input
                  type="file"
                  multiple
                  onChange={handleUploadButton}
                  style={{ display: "none" }}
                  ref={fileUpload}
                />
                <input
                  type="file"
                  multiple
                  onChange={handleUploadButton}
                  style={{ display: "none" }}
                  ref={folderUpload}
                />
                <UploadFilesButton
                  bucketName={bucketName}
                  uploadPath={uploadPath.join("/")}
                  uploadFileFunction={(closeMenu) => {
                    if (fileUpload && fileUpload.current) {
                      fileUpload.current.click();
                    }
                    closeMenu();
                  }}
                  uploadFolderFunction={(closeMenu) => {
                    if (folderUpload && folderUpload.current) {
                      folderUpload.current.click();
                    }
                    closeMenu();
                  }}
                />
              </Fragment>
            }
          />
        </Grid>
        <div
          id="object-list-wrapper"
          {...getRootProps({ style: { ...dndStyles } })}
        >
          <input {...getInputProps()} />
          <Grid
            item
            xs={12}
            className={classes.tableBlock}
            sx={{ border: "#EAEDEE 1px solid", borderTop: 0 }}
          >
            {versionsMode ? (
              <Fragment>
                {selectedInternalPaths !== null && (
                  <VersionsNavigator
                    internalPaths={selectedInternalPaths}
                    bucketName={bucketName}
                  />
                )}
              </Fragment>
            ) : (
              <SecureComponent
                scopes={[IAM_SCOPES.S3_LIST_BUCKET]}
                resource={bucketName}
                errorProps={{ disabled: true }}
              >
                <Grid item xs={12}>
                  <Grid item xs={12} className={classes.breadcrumbsContainer}>
                    <BrowserBreadcrumbs
                      bucketName={bucketName}
                      internalPaths={pageTitle}
                      existingFiles={records || []}
                      additionalOptions={
                        !isVersioned || rewindEnabled ? null : (
                          <div>
                            <CheckboxWrapper
                              name={"deleted_objects"}
                              id={"showDeletedObjects"}
                              value={"deleted_on"}
                              label={"Show deleted objects"}
                              onChange={setDeletedAction}
                              checked={showDeleted}
                              overrideLabelClasses={classes.labelStyle}
                              noTopMargin
                            />
                          </div>
                        )
                      }
                      hidePathButton={false}
                    />
                  </Grid>
                  <TableWrapper
                    itemActions={tableActions}
                    columns={
                      rewindEnabled ? rewindModeColumns : listModeColumns
                    }
                    isLoading={rewindEnabled ? loadingRewind : loading}
                    loadingMessage={loadingMessage}
                    entityName="Objects"
                    idField="name"
                    records={payload}
                    customPaperHeight={`${classes.browsePaper} ${
                      detailsOpen ? "actionsPanelOpen" : ""
                    }`}
                    selectedItems={selectedObjects}
                    onSelect={selectListObjects}
                    customEmptyMessage={`This location is empty${
                      !rewindEnabled ? ", please try uploading a new file" : ""
                    }`}
                    sortConfig={{
                      currentSort: currentSortField,
                      currentDirection: sortDirection,
                      triggerSort: sortChange,
                    }}
                    onSelectAll={selectAllItems}
                    rowStyle={({ index }) => {
                      if (payload[index]?.delete_flag) {
                        return "deleted";
                      }

                      return "";
                    }}
                  />
                </Grid>
              </SecureComponent>
            )}
            <SecureComponent
              scopes={[IAM_SCOPES.S3_LIST_BUCKET]}
              resource={bucketName}
              errorProps={{ disabled: true }}
            >
              <DetailsListPanel
                open={detailsOpen}
                closePanel={() => {
                  onClosePanel(false);
                }}
              >
                {selectedObjects.length > 0 && (
                  <ActionsListSection
                    items={multiActionButtons}
                    title={"Selected Objects:"}
                  />
                )}
                {selectedInternalPaths !== null && (
                  <ObjectDetailPanel
                    internalPaths={selectedInternalPaths}
                    bucketName={bucketName}
                    onClosePanel={onClosePanel}
                    versioning={isVersioned}
                    locking={lockingEnabled}
                  />
                )}
              </DetailsListPanel>
            </SecureComponent>
          </Grid>
        </div>
      </PageLayout>
    </Fragment>
  );
};

const mapStateToProps = ({ objectBrowser, buckets }: AppState) => ({
  routesList: get(objectBrowser, "routesList", []),
  downloadingFiles: get(objectBrowser, "downloadingFiles", []),
  rewindEnabled: get(objectBrowser, "rewind.rewindEnabled", false),
  rewindDate: get(objectBrowser, "rewind.dateToRewind", null),
  bucketToRewind: get(objectBrowser, "rewind.bucketToRewind", ""),
  versionsMode: get(objectBrowser, "versionsMode", false),
  loadingBucket: buckets.bucketDetails.loadingBucket,
  bucketInfo: buckets.bucketDetails.bucketInfo,
  searchObjects: objectBrowser.searchObjects,
  showDeleted: objectBrowser.showDeleted,
});

const mapDispatchToProps = {
  setSnackBarMessage,
  setErrorSnackMessage,
  resetRewind,
  setBucketDetailsLoad,
  setBucketInfo,
  setNewObject,
  updateProgress,
  completeObject,
  openList,
  setSearchObjects,
  setVersionsModeEnabled,
  setShowDeletedObjects,
  setLoadingVersions,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(withStyles(styles)(ListObjects)));
