import React, { useEffect, useState, memo } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Flex } from '@strapi/design-system';
import { Page, useNotification, Layouts } from '@strapi/strapi/admin';
import { DocumentEditor } from '@onlyoffice/document-editor-react';

import { useSearch, useQueryParams, usePermissions } from '../hooks';

import { getFileFavicon, omitExt, getTrad } from '../utils';
import { onAppReady, onError, buildOnRequestSave } from '../utils/editor';

import { PLUGIN_ID } from '../pluginId';

const EditorFrame = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
`;

const EditorPage = () => {
  const params = useQueryParams();
  const navigate = useNavigate();
  const { toggleNotification } = useNotification();
  const { formatMessage, locale } = useIntl();
  const { canCreate } = usePermissions();

  const [editorReady, setEditorReady] = useState(false);

  const { data, isLoading, isError } = useSearch(
    `/${PLUGIN_ID}/editor/${params.file}/${locale}`,
    { cacheTimeout: 0 }
  )();

  if (!params.file) {
    navigate(-1);
    return null;
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!isLoading && isError) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: getTrad('editor.config.error'),
          defaultMessage: 'Error getting editor config',
        }),
      });

      navigate(-1);
    }
  }, [isLoading, isError]);

  const handleApiUnreachable = () => {
    toggleNotification({
      type: 'warning',
      message: formatMessage({
        id: getTrad('notification.api.unreachable'),
        defaultMessage: 'ONLYOFFICE cannot be reached',
      }),
    });

    navigate(-1);
  };

  const handleSaveAsSuccess = () => {
    toggleNotification({
      type: 'success',
      message: formatMessage({
        id: getTrad('editor.save-as.success'),
        defaultMessage: 'Document was saved as {filename}',
      }, { filename: omitExt(data?.document?.title) }),
    });
  };

  const handleSaveAsError = () => {
    toggleNotification({
      type: 'warning',
      message: formatMessage({
        id: getTrad('editor.save-as.error'),
        defaultMessage: 'Something went wrong',
      }),
    });
  };

  const loadOnlyofficeScript = () => {
    if (!data?.server) return;

    const script = document.createElement('script');
    script.src = `${data.server}/web-apps/apps/api/documents/api.js`;
    script.onerror = handleApiUnreachable;
    script.onload = () => {
      data.events = { onAppReady, onError };
      if (canCreate) { data.events.onRequestSaveAs = buildOnRequestSave(handleSaveAsSuccess, handleSaveAsError); }
      data.editorConfig.customization.goback.url = window.location.toString()
        .substring(0, window.location.toString().lastIndexOf('/'));

      setEditorReady(true);
    };

    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  };

  useEffect(() => {
    return loadOnlyofficeScript();
  }, [data]);

  const renderError = () => (
    <Flex alignItems="center" justifyContent="center" height="100vh">
      <Layouts.Content>
        <Page.NoPermissions />
      </Layouts.Content>
    </Flex>
  );

  const renderEditor = () => (
    <>
      <Helmet
        title={formatMessage({
          id: getTrad('editor.title'),
          defaultMessage: 'ONLYOFFICE - {filename}',
        }, { filename: data?.document?.title })}
        link={[{
          rel: 'shortcut icon',
          type: 'image/x-icon',
          href: getFileFavicon(data?.document?.fileType)
        }]}
      />
      <EditorFrame>
        <DocumentEditor
          id="onlyoffice-editor"
          documentServerUrl={data.server}
          config={data}
          onLoadComponentError={() => console.log('Error loading component')}
        />
      </EditorFrame>
    </>
  );

  if (isLoading) {
    return <Page.Loading />;
  }

  if (!isLoading && (isError || !data)) {
    return renderError();
  }

  return (
    <Layouts.Root>
      {editorReady ? renderEditor() : <Page.Loading />}
    </Layouts.Root>
  );
};

export default memo(EditorPage);
