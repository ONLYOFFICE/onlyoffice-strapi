/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  IconButton,
  Tooltip,
  Typography,
  Th,
  Thead,
  Tr,
} from '@strapi/design-system';
import { CaretUp, CaretDown } from '@strapi/icons';
import { useLocation, useNavigate } from 'react-router-dom';

import getTrad from '../utils/getTrad';
import useQueryParams from '../hooks/useQueryParams';

const Sort = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const SortIcon = ({ isAscending }) => (
  isAscending ? <CaretUp /> : <CaretDown />
);

SortIcon.propTypes = {
  isAscending: PropTypes.bool.isRequired,
};

const TableHead = ({ headers = [] }) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const queryParams = useQueryParams();
  const [sortBy, sortOrder] = (queryParams?.sort || '').split(':');

  const handleSort = (name, isSortable) => {
    if (!isSortable) return;

    const nextSortOrder = sortBy === name && sortOrder === Sort.ASC ? Sort.DESC : Sort.ASC;
    const nextSort = `${name}:${nextSortOrder}`;

    const params = new URLSearchParams(search);
    params.set('sort', nextSort);
    navigate({ search: `?${params.toString()}` });
  };

  const renderHeader = ({ name, metadatas: { sortable: isSortable, label } }) => {
    const isSorted = sortBy === name;
    const isAscending = sortOrder === Sort.ASC;

    const intlLabel = formatMessage({
      id: getTrad(`table.${name}`),
      defaultMessage: label,
    });

    const sortLabel = formatMessage(
      {
        id: getTrad('table.sort'),
        defaultMessage: 'Sort on {label}',
      },
      { label: intlLabel }
    );

    return (
      <Th
        key={name}
        action={
          isSortable && isSorted
            ? (
            <IconButton
              label={sortLabel}
              onClick={() => handleSort(name, isSortable)}
              style={{ marginLeft: '8px' }}
            >
              <SortIcon isAscending={isAscending} />
            </IconButton>
              )
            : undefined
        }
      >
        <Tooltip label={isSortable ? sortLabel : intlLabel}>
          <button
            type="button"
            style={{
              border: 'none',
              background: 'none',
              cursor: isSortable ? 'pointer' : 'default',
              padding: 0
            }}
            onClick={() => handleSort(name, isSortable)}
          >
            <Typography
              textColor='neutral600'
              variant='sigma'
            >
              {intlLabel}
            </Typography>
          </button>
        </Tooltip>
      </Th>
    );
  };

  return (
    <Thead>
      <Tr>
        <Th />
        {headers.map(renderHeader)}
      </Tr>
    </Thead>
  );
};

TableHead.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      metadatas: PropTypes.shape({
        label: PropTypes.string.isRequired,
        sortable: PropTypes.bool,
      }).isRequired,
    })
  ),
};

export default TableHead;
