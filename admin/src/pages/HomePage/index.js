/*
 *
 * HomePage
 *
 */
/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/

import React, {memo, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {
  LoadingIndicatorPage,
  SearchURLQuery,
  useRBAC
} from '@strapi/helper-plugin';
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
import makeSelectOnlyofficeEditor from "./selectors";
import {compose} from "redux";
import PropTypes from "prop-types";
import {connect, useDispatch} from 'react-redux';
import {GET_EDITOR_SETTINGS_SUCCEEDED, RESET_EDITOR_FILE, SET_EDITOR_FILE, SET_EDITOR_PERMISSIONS} from "./constants";

const uploadPluginPermissions = {
  read: [{action: 'plugin::upload.read', subject: null}],
  update: [{action: 'plugin::upload.assets.update', subject: null, fields: null}],
};

const HomePage = ({isLoading, editorFile, docServConfig}) => {
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

  const dispatch = useDispatch();

  const getDocServConfig = async () => {
    const res = await axiosInstance.get(`/${pluginId}/getOnlyofficeSettings`);
    const editorConfig = res.data.docServConfig;

    dispatch({
      type: GET_EDITOR_SETTINGS_SUCCEEDED,
      docServConfig: editorConfig
    });
  };

  const setEditorPermissions = () => {
    const permissions = {
      canEdit: canUpdate,
      canRead: canRead
    };
    dispatch({
      type: SET_EDITOR_PERMISSIONS,
      editorPermissions: permissions
    });
  };

  useEffect(() => {
    setEditorPermissions();
  }, [canRead, canUpdate]);

  const resetEditorFile = () => {
    dispatch({type: RESET_EDITOR_FILE});
  }

  useEffect(() => {
    if (!docServConfig.docServUrl) {
      getDocServConfig();
    }
    if (editorFile.name) {
      resetEditorFile();
    }
  }, []);

  const openEditor = (editorFile) => {
    if (canRead || canUpdate) {
      dispatch({
        type: SET_EDITOR_FILE,
        editorFile: editorFile,
      });
      push({
        pathname: `${pathname}/editor`
      });
    }
  };

  if (isFetching || isLoading) {
    return <LoadingIndicatorPage/>;
  }

  if (!isLoading && !can0 && !isFetching) {
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
  } else if (can0 && !isLoading && !docServConfig.docServUrl) {
    push({
      pathname: `${pathname.replace(`/plugins/${pluginId}`, `/settings/${pluginId}`)}`
    });
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
          isLoading={isFetching && isLoading}
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

HomePage.defaultProps = {
  editorFile: {},
  docServConfig: {}
};

HomePage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  editorFile: PropTypes.object,
  docServConfig: PropTypes.object.isRequired
};

const mapStateToProps = makeSelectOnlyofficeEditor();
const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(memo(HomePage));
