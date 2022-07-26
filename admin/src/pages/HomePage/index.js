/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  Layout,
  HeaderLayout,
  ContentLayout,
} from '@strapi/design-system/Layout';
import {
  SearchURLQuery,
  LoadingIndicatorPage,
  NoPermissions,
} from '@strapi/helper-plugin';
import { Main } from '@strapi/design-system';

import { FileTable, PaginationFooter } from '../../components/DynamicTable';

import { useSearch, usePermissions } from '../../hooks';
import { getTrad, sanitizeFile, Maybe, STRAPI_FILE_FILTER } from '../../utils';
import { FileHeaders } from '../../data/layout';
import { pluginDisplayName } from '../../pluginId';

const HomePage = () => {
  const { search } = useLocation();
  const { canRead } = usePermissions();
  const { formatMessage } = useIntl();
  const fetchStrapiFiles = useSearch(
    `${process.env.STRAPI_ADMIN_BACKEND_URL}/upload/files`,
    { enabled: canRead },
  );

  const searchParams = Object.fromEntries(
    new URLSearchParams(search + STRAPI_FILE_FILTER)
  );

  if (!searchParams?.page && !searchParams.pageSize) {
    searchParams.page = 1;
  }

  const { isFetching, data } = new Maybe(searchParams)
    .bind(fetchStrapiFiles)
    .bind((response) => {
      const done = !response?.isFetching && !response?.isError;
      if (done && response?.data?.results) {
        response.data.results = response.data.results.map((file) =>
          sanitizeFile(file)
        );
      }
      return response;
    }).value;

  const totalFiles = data?.pagination?.total || 0;

  return (
    <Layout>
      <Main>
        <HeaderLayout
          title={pluginDisplayName}
          primaryAction={
            <SearchURLQuery
              label={formatMessage({
                id: getTrad('onlyoffice.files.list.files-search'),
                defaultMessage: 'Search',
              })}
            />
          }
          subtitle={formatMessage(
            {
              id: getTrad(
                `onlyoffice.content.files-${
                  totalFiles === 1 ? 'single' : 'multiple'
                }`
              ),
              defaultMessage: `${totalFiles} ${totalFiles === 1 ? 'file' : 'files'}`,
            },
            { number: totalFiles }
          )}
        />
        {isFetching && <LoadingIndicatorPage />}
        {!isFetching && (
          <ContentLayout>
            {!canRead && <NoPermissions />}
            {canRead && data?.results && (
              <>
                <FileTable
                  headers={FileHeaders}
                  isLoading={isFetching}
                  rows={data.results}
                />
                <PaginationFooter pagination={data.pagination} />
              </>
            )}
          </ContentLayout>
        )}
      </Main>
    </Layout>
  );
};

export default memo(HomePage);
