/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Main } from '@strapi/design-system';
import { Layouts, Page, SearchInput } from '@strapi/strapi/admin';

import FileTable from '../components/FileTable';
import PaginationFooter from '../components/FileTableFooter';

import { getTrad, sanitizeFile, STRAPI_FILE_FILTER } from '../utils';
import { useSearch, usePermissions } from '../hooks';
import { FileHeaders } from '../data/layout';

const HomePage = () => {
  const { search } = useLocation();
  const { canRead } = usePermissions();
  const { formatMessage } = useIntl();

  const fetchStrapiFiles = useSearch('/upload/files', { enabled: canRead });
  const searchParams = useMemo(() => ({
    page: 1,
    ...Object.fromEntries(new URLSearchParams(search + STRAPI_FILE_FILTER))
  }), [search]);

  const { isLoading, data } = fetchStrapiFiles(searchParams);

  const processedData = useMemo(() => {
    if (!data?.results) return data;
    return {
      ...data,
      results: data.results.map(sanitizeFile)
    };
  }, [data]);

  const totalFiles = processedData?.pagination?.total || 0;

  if (!canRead) {
    return (
      <Layouts.Root>
        <Main>
          <Page.NoPermissions />
        </Main>
      </Layouts.Root>
    );
  }

  return (
    <Layouts.Root>
      <Main>
        <Layouts.Header
          title="ONLYOFFICE"
          primaryAction={
            <SearchInput
              placeholder={formatMessage({
                id: getTrad('files.list.files-search'),
                defaultMessage: 'Search',
              })}
            />
          }
          subtitle={formatMessage(
            {
              id: getTrad(`content.files-${totalFiles === 1 ? 'single' : 'multiple'}`),
              defaultMessage: `${totalFiles} ${totalFiles === 1 ? 'file' : 'files'}`,
            },
            { number: totalFiles }
          )}
        />
        <Layouts.Content>
          {isLoading
            ? (
            <Page.Loading />
              )
            : processedData?.results
              ? (
            <>
              <FileTable
                headers={FileHeaders}
                isLoading={isLoading}
                rows={processedData.results}
              />
              <PaginationFooter pagination={processedData.pagination} />
            </>
                )
              : null}
        </Layouts.Content>
      </Main>
    </Layouts.Root>
  );
};

export default memo(HomePage);
