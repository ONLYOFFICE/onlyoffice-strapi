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
  useRBAC
} from '@strapi/helper-plugin';
import Editor from '../Editor';
import {ContentLayout} from '@strapi/design-system/Layout';
import PaginationFooter from "../../components/PaginationFooter";
import OnlyofficeLogo from "../../components/OnlyofficeLogo";
import CenterActionLayout from '../../components/CenterActionLayout';
import pluginId from "../../pluginId";
import axiosInstance from "../../utils/axiosInstance";
import tableHeaders from "./utils/tableHeaders";
import permissions from "../../permissions";
import TableRows from "./TableRows";
import {useQuery} from 'react-query';
import {fetchFiles} from '../utils/api';
import {Main} from '@strapi/design-system/Main';
import getTrad from '../../utils/getTrad';
import DynamicTable from './DynamicTable';
import {EmptyStateLayout} from '@strapi/design-system/EmptyStateLayout';
import EmptyDocuments from '@strapi/icons/EmptyDocuments';

const uploadPluginPermissions = {
  read: [{action: 'plugin::upload.read', subject: null}],
  update: [{action: 'plugin::upload.assets.update', subject: null, fields: null}],
};

const HomePage = () => {
  const {formatMessage} = useIntl();
  const {pathname, search} = useLocation();
  const {push} = useHistory();
  const {allowedActions: {can0}} = useRBAC(permissions.settings); // check user has access to settings
  const {allowedActions: {canRead, canUpdate}} = useRBAC(uploadPluginPermissions);
  const queryName = ['files', search];
  const {
    data,
    isFetching
  } = useQuery(queryName, () => fetchFiles(search));
  const filesCount = data?.pagination?.total || 0;

  const [editorFile, setEditorFile] = useState(null);
  const [isEditor, setIsEditor] = useState(false);
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

  const openEditor = (file) => {
    if (canRead || canUpdate) {
      setEditorFile(file);
      setIsEditor(true);
    }
  };

  if (isFetching) {
    return <LoadingIndicatorPage/>;
  }

  if (docServConfig && docServConfig.docServUrl === null && !can0 && !isFetching) {
  return (
    <Main>
      <CenterActionLayout
        startActions={
          <OnlyofficeLogo/>
        }
      />
      <ContentLayout>
        <EmptyStateLayout
          icon={<EmptyDocuments width="10rem"/>}
          content={formatMessage(
            {id: getTrad('onlyoffice.docserv-url.empty'), defaultMessage: 'Document Server Address is not set'}
          )}
        />
      </ContentLayout>
    </Main>
  );
  } else if (can0 && docServConfig && docServConfig.docServUrl === null) {
    push({
      pathname: `${pathname.replace(`/plugins/${pluginId}`, `/settings/${pluginId}`)}`
    });
  }

  if (isEditor && editorFile) {
    return <Editor file={editorFile} docServConfig={docServConfig} canEdit={canUpdate} canRead={canRead}/>
  }

  return (
    <Main>
      <CenterActionLayout
        startActions={
          <OnlyofficeLogo/>
        }
      />
      <CenterActionLayout
        startActions={
          formatMessage({
              id: getTrad('onlyoffice.content.files-multiple'),
              defaultMessage: '0 files',
            },
            {number: filesCount}
          )}
        endActions={
          <SearchURLQuery
            label={formatMessage({
              id: getTrad('onlyoffice.files.list.files-search'),
              defaultMessage: 'Search',
            })}
          />
        }
      />
      <ContentLayout>
        <DynamicTable
          isLoading={isFetching}
          headers={tableHeaders}
          rows={data.results}
        >
          <TableRows
            headers={tableHeaders}
            rows={data.results}
            openEditor={openEditor}
          />
        </DynamicTable>
        <PaginationFooter pagination={data.pagination}/>
      </ContentLayout>
    </Main>
  );
};

export default memo(HomePage);
