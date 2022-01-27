/*
 *
 * HomePage
 *
 */
/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/

import React, {memo, useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {
  LoadingIndicatorPage,
  SearchURLQuery,
  useQueryParams,
  DynamicTable,
  NoContent,
  useRBAC
} from '@strapi/helper-plugin';
import Editor from '../Editor';
import {ContentLayout, ActionLayout} from '@strapi/design-system/Layout';
import PaginationFooter from "../../components/PaginationFooter";
import OnlyofficeLogo from "../../components/OnlyofficeLogo";
import CenterActionLayout from '../../components/CenterActionLayout';
import {isFileEditable, isFileViewable} from '../../utils/fileUtility';
import pluginId from "../../pluginId";
import axiosInstance from "../../utils/axiosInstance";
import matchSorter from 'match-sorter';
import tableHeaders from "./utils/tableHeaders";
import permissions from "../../permissions";
import TableRows from "./TableRows";


const HomePage = () => {
  const {formatMessage} = useIntl();
  const [{query}] = useQueryParams();
  const _q = query?._q || '';
  const {pathname} = useLocation();
  const {push} = useHistory();
  const {allowedActions: {can0}} = useRBAC(permissions.settings); // check user has access to settings

  const [isLoading, setIsLoading] = useState(true);
  const [editorFile, setEditorFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isEditor, setIsEditor] = useState(false);
  const [filesPagination, setFilesPagination] = useState(null);
  const [docServConfig, setDocServConfig] = useState(null);

  const getDocServConfig = async () => {
    if (docServConfig === null) {
      const res = await axiosInstance.get(`/${pluginId}/getOnlyofficeSettings`);
      return res.data.docServConfig;
    }
  };

  useEffect(() => {
    getDocServConfig()
      .then((result) => {
        if (result) {
          setDocServConfig(result);
        }
      });
  }, []);

  const updateFiles = () => {
    axiosInstance.get('/upload/files')
      .then((result) => {
        const tmp = [];
        result.data.results.forEach((file) => {
          if (isFileViewable(file.ext) || isFileEditable(file.ext)) {
            tmp.push(file);
          }
        });

        setFiles(tmp);
        setIsLoading(false);
        setFilesPagination(result.data.pagination);
      });
  }

  useEffect(() => {
    let refreshInterval;
    setFiles([]);
    if (!isEditor) {
      updateFiles();
      setIsLoading(true);
      refreshInterval = setInterval(() => {
        updateFiles();
      }, 5000);
    }

    return () => clearInterval(refreshInterval);
  }, [isEditor]);

  const sortedFiles = matchSorter(files || [], _q, {keys: ['name', 'type', 'size', 'last modified']});
  const emptyContent = _q && !sortedFiles.length ? 'search' : 'files';

  if (isLoading || filesPagination === null) {
    return <LoadingIndicatorPage/>;
  }

  if (!isLoading && docServConfig && docServConfig.docServUrl === null && !can0) {
    return <NoContent content={{
      id: 'onlyoffice.docserv-url.empty',
      defaultMessage: 'Document Server Address is not set'
    }}/>
  } else if (can0 && docServConfig && docServConfig.docServUrl === null) {
    push({
      pathname: `${pathname.replace(`/plugins/${pluginId}`, `/settings/${pluginId}`)}`
    });
  }

  return (
    <>
      {isEditor && editorFile ? (
        <Editor file={editorFile} docServConfig={docServConfig}/>
      ) : (
        <>
          <CenterActionLayout
            startActions={
              <OnlyofficeLogo/>
            }
          />
          {files?.length ? (
            <ActionLayout
              endActions={
                <SearchURLQuery
                  label={formatMessage({
                    id: 'onlyoffice.files.list.files-search',
                    defaultMessage: 'Search',
                  })}
                />
              }
            />
          ) : <></>}
          <ContentLayout>
            {/*{sortedFiles && sortedFiles?.length ?*/}
            {/*  (<>*/}
            <DynamicTable
              isLoading={isLoading}
              headers={tableHeaders}
              rows={sortedFiles}
            >
              {/*<TableRows*/}
              {/*  headers={tableHeaders}*/}
              {/*  rows={sortedFiles}*/}
              {/*/>*/}
            </DynamicTable>
            <PaginationFooter pagination={filesPagination}/>
          </ContentLayout>
        </>
      )}
    </>
  );
};

export default memo(HomePage);
