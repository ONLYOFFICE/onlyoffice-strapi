import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { useTheme } from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import { EmptyStateLayout, DesignSystemProvider } from '@strapi/design-system';

import HomePage from './HomePage';
import EditorPage from './EditorPage';

import { getTrad } from '../utils';

const NotFound = () => {
  const { formatMessage } = useIntl();

  return (
    <EmptyStateLayout
      content={formatMessage({
        id: getTrad('not-found'),
        defaultMessage: 'Not found',
      })}
    />
  );
};

const App = () => {
  const theme = useTheme();
  return (
    <div>
      <Helmet title={'ONLYOFFICE'} />
      <DesignSystemProvider theme={theme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DesignSystemProvider>
    </div>
  );
};

export default App;
