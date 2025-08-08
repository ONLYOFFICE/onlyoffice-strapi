/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Box, Flex, Button, Typography, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { ChevronLeft, ChevronRight } from '@strapi/icons';
import { useQueryParams } from '@strapi/strapi/admin';

import { getTrad } from '../utils';

const PageSizeSelector = () => {
  const { formatMessage } = useIntl();
  const [{ query }, setQuery] = useQueryParams();
  const pageSize = parseInt(query?.pageSize) || 10;

  const handlePageSizeChange = (newPageSize) => {
    setQuery({
      ...query,
      pageSize: newPageSize,
      page: 1,
    });
  };

  return (
    <SingleSelect
      size="S"
      value={String(pageSize)}
      onChange={(value) => handlePageSizeChange(parseInt(value))}
    >
      {[10, 20, 50, 100].map((size) => (
        <SingleSelectOption key={size} value={String(size)}>
          {formatMessage(
            {
              id: getTrad('pagination.entries-per-page'),
              defaultMessage: '{size} entries per page',
            },
            { size }
          )}
        </SingleSelectOption>
      ))}
    </SingleSelect>
  );
};

const PaginationControls = ({ pagination }) => {
  const { formatMessage } = useIntl();
  const [{ query }, setQuery] = useQueryParams();
  const currentPage = parseInt(query?.page) || 1;

  const handlePageChange = (page) => {
    setQuery({ ...query, page });
  };

  if (!pagination || pagination.pageCount <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.pageCount, startPage + maxVisiblePages - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
      const pageNum = startPage + i;
      return (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? 'secondary' : 'tertiary'}
          size="S"
          onClick={() => handlePageChange(pageNum)}
          style={{ margin: '0 2px' }}
        >
          {pageNum}
        </Button>
      );
    });
  };

  return (
    <Flex alignItems="center" gap={2}>
      <Button
        variant="tertiary"
        size="S"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        startIcon={<ChevronLeft />}
      >
        {formatMessage({
          id: getTrad('pagination.previous'),
          defaultMessage: 'Previous',
        })}
      </Button>

      {renderPageNumbers()}

      <Button
        variant="tertiary"
        size="S"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= pagination.pageCount}
        endIcon={<ChevronRight />}
      >
        {formatMessage({
          id: getTrad('pagination.next'),
          defaultMessage: 'Next',
        })}
      </Button>

      <Typography variant="pi" textColor="neutral600">
        {formatMessage({
          id: getTrad('pagination.page-of'),
          defaultMessage: 'Page {current} of {total}',
        }, { current: currentPage, total: pagination.pageCount })}
      </Typography>
    </Flex>
  );
};

PaginationControls.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
  }),
};

const FileTableFooter = ({
  pagination = {
    pageCount: 0,
    pageSize: 10,
    total: 0,
  }
}) => {
  return (
    <Box paddingTop={4}>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <PageSizeSelector />
        <PaginationControls pagination={pagination} />
      </Flex>
    </Box>
  );
};

FileTableFooter.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
  }),
};

export default FileTableFooter;
