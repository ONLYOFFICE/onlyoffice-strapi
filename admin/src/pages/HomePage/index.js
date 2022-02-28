/*
 *
 * HomePage
 *
 */
/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

const HomePage = ({isLoading, editorFileId, editorUrl}) => {
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

  const getEditorUrl = async () => {
    const res = await axiosInstance.get(`/${pluginId}/getEditorUrl`);
    const editorUrl = res.data.docServUrl;

    dispatch({
      type: GET_EDITOR_SETTINGS_SUCCEEDED,
      editorUrl: editorUrl
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
    getEditorUrl();
    if (editorFileId) {
      resetEditorFile();
    }
  }, []);

  const openEditor = (editorFileId) => {
    if (canRead || canUpdate) {
      dispatch({
        type: SET_EDITOR_FILE,
        editorFileId: editorFileId,
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
            {id: getTrad('onlyoffice.docserv-url.empty'), defaultMessage: 'Something wrong with your settings/token. Please try again later or contact your administrator.'}
          )}
        />
      </ContentLayout>
    </Main>
  );
  } else if (can0 && !isLoading && !editorUrl) {
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
  editorFileId: {},
  editorUrl: {}
};

HomePage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  editorFileId: PropTypes.object,
  editorUrl: PropTypes.object.isRequired
};

const mapStateToProps = makeSelectOnlyofficeEditor();
const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(memo(HomePage));
