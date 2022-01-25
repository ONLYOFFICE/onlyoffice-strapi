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
  CheckPermissions,
  LoadingIndicatorPage,
  SearchURLQuery,
  useQueryParams,
  DynamicTable,
  NoContent
} from '@strapi/helper-plugin';
import Editor from '../Editor';
import {ContentLayout, ActionLayout} from '@strapi/design-system/Layout';
import {Box} from '@strapi/design-system/Box';
import {IconButton} from '@strapi/design-system/IconButton';
import PaginationFooter from "../../components/PaginationFooter";
import OnlyofficeLogo from "../../components/OnlyofficeLogo";
import CenterActionLayout from '../../components/CenterActionLayout';
import {isFileEditable, isFileViewable} from '../../utils/fileUtility';
import pluginId from "../../pluginId";
import axiosInstance from "../../utils/axiosInstance";
import matchSorter from 'match-sorter';
import tableHeaders from "./utils/tableHeaders";
import Cog from '@strapi/icons/Cog';
import styled from "styled-components";
import permissions from "../../permissions";

const IconButtonCustom = styled(IconButton)`
  svg {
    path {
      fill: ${({theme}) => theme.colors.neutral900};
    }
  }
`;

const HomePage = () => {
  const {formatMessage} = useIntl();
  const [{query}] = useQueryParams();
  const _q = query?._q || '';
  const {pathname} = useLocation();
  const {push} = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [editorFile, setEditorFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isEditor, setIsEditor] = useState(false);
  const [filesPagination, setFilesPagination] = useState(null);
  const [docServConfig, setDocServConfig] = useState(null);

  const emptyLayout = {
    files: {
      id: 'onlyoffice.onlyoffice.files.empty',
      defaultMessage: 'No available files',
    },
    search: {
      id: 'onlyoffice.onlyoffice.files.empty.search',
      defaultMessage: 'No files match the search',
    }
  };

  const getDocServConfig = async () => {
    if (docServConfig === null) {
      const res = await axiosInstance.get(`/${pluginId}/getOnlyofficeSettings`);
      return res.data.docServConfig;
    }
  };

  useEffect(() => {
    getDocServConfig()
      .then((result) => {
        if (result && result.docServUrl === null) {
          //check if admin
          push({
            pathname: `${pathname}/settings`
          });
        } else if (result && result.docServUrl !== null) setDocServConfig(result);
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
            endActions={
              <CheckPermissions permissions={permissions.settings}>
                <Box paddingTop={1} paddingBottom={1}>
                  <IconButtonCustom
                    onClick={() => {
                      push({
                        pathname: `${pathname}/settings`
                      });
                    }}
                    icon={<Cog/>}
                    label={formatMessage({
                      id: 'onlyoffice.settings.button.configure',
                      defaultMessage: 'Configure the ONLYOFFICE editor settings',
                    })}
                  />
                </Box>
              </CheckPermissions>
            }/>
          {sortedFiles?.length ? (
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
            {sortedFiles && sortedFiles?.length ?
              (<>
                <DynamicTable
                  isLoading={isLoading}
                  headers={tableHeaders}
                  rows={files}
                >
                </DynamicTable>
                <PaginationFooter pagination={filesPagination}/>
              </>) :
              (
                <NoContent content={{
                  id: emptyLayout[emptyContent].id,
                  defaultMessage: emptyLayout[emptyContent].defaultMessage
                }}/>
              )}
          </ContentLayout>
        </>
      )}
    </>
  );
};

export default memo(HomePage);