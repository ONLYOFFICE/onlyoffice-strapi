/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import React, { useEffect, useState, memo } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Flex, Layout, ContentLayout } from '@strapi/design-system';
import { useNotification, LoadingIndicatorPage, NoPermissions } from '@strapi/helper-plugin';

import { useSearch, useQueryParams, usePermissions } from '../../hooks';

import { getFileFavicon, omitExt, getTrad } from '../../utils';
import { onAppReady, onError, buildOnRequestSave } from '../../utils/editor';

const EditorFrame = styled.div`
  width: 100%;
  height: 99.8vh;
  position: absolute;
  z-index: 2;
  left: 0;
`;

const OnlyofficeEditor = () => {
  const params = useQueryParams();
  const { goBack } = useHistory();
  if (!params.file) goBack();

  const [accessible, setAccessible] = useState(false);
  const dispatchNotification = useNotification();
  const { formatMessage } = useIntl();
  const { canCreate } = usePermissions();
  const { data, isLoading, isError } = useSearch(`/onlyoffice/editor/${params.file}`, { cacheTimeout: 0 })();

  useEffect(() => {
    if (!data?.server) return;

    const script = document.createElement('script');
    script.src = `${data.server}/web-apps/apps/api/documents/api.js`;
    script.onerror = () => onCatch();
    script.onload = () => {
      data.events = { onAppReady, onError };
      if (canCreate) data.events.onRequestSaveAs = buildOnRequestSave(onSuccessSaveAs, onFailedSaveAs);
      data.editorConfig.customization.goback.url = window.location.toString()
        .substring(0, window.location.toString().lastIndexOf('/'));

      setAccessible(true);
      // eslint-disable-next-line no-unused-vars
      const _ = window.DocsAPI.DocEditor('onlyoffice-editor', data);
    }

    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [data]);

  const onCatch = () => {
    dispatchNotification({
      type: 'warning',
      message: formatMessage({
        id: getTrad('onlyoffice.notification.api.unreachable'),
        defaultMessage: 'ONLYOFFICE cannot be reached',
      }),
    });
    goBack();
  }

  const onSuccessSaveAs = () => {
    dispatchNotification({
      type: 'success',
      message: formatMessage({
        id: getTrad('onlyoffice.editor.save-as.success'),
        defaultMessage: 'Document was saved as {filename}',
      }, { filename: omitExt(data?.document?.title) }),
    });
  }

  const onFailedSaveAs = () => {
    dispatchNotification({
      type: 'warning',
      message: formatMessage({
        id: getTrad('onlyoffice.editor.save-as.error'),
        defaultMessage: 'Something went wrong',
      }),
    });
  }

  return (
    <Layout>
      {isError && (
        <Flex
          alignItems='center'
          justifyContent='center'
          height='100vh'
        >
          <ContentLayout>
            <NoPermissions/>
          </ContentLayout>
        </Flex>
      )}
      {isLoading && <LoadingIndicatorPage/>}
      {!isLoading && !isError && accessible && (
        <>
          <Helmet
            title={formatMessage({
              id: getTrad('onlyoffice.editor.title'),
              defaultMessage: 'ONLYOFFICE - {filename}',
            }, { filename: data?.document?.title })}
            link={[{ rel: 'shortcut icon', type: 'image/x-icon', href: `${getFileFavicon(data?.document?.fileType)}` }]}
          />
          <EditorFrame>
            <div id="onlyoffice-editor" />
          </EditorFrame>
        </>
      )}
    </Layout>
  );
};

export default memo(OnlyofficeEditor);
