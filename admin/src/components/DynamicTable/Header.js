/*
 * (c) Copyright Ascensio System SIA 2022
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
import { useQueryParams, SortIcon } from '@strapi/helper-plugin';

import getTrad from '../../utils/getTrad';

const Sort = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const TableHead = ({ headers }) => {
  const { formatMessage } = useIntl();
  const [{ query }, setQuery] = useQueryParams();
  const [sortBy, sortOrder] = (query?.sort || '').split(':');

  return (
    <Thead>
      <Tr>
        <Th />
        {headers.map(({ name, metadatas: { sortable: isSortable, label } }) => {
          const isSorted = sortBy === name;
          const isUp = sortOrder === Sort.ASC;

          const handleClickSort = (shouldAllowClick = true) => {
            if (isSortable && shouldAllowClick) {
              const nextSortOrder =
                isSorted && sortOrder === Sort.ASC ? Sort.DESC : Sort.ASC;
              const nextSort = `${name}:${nextSortOrder}`;
              setQuery({
                sort: nextSort,
              });
            }
          };

          const sortLabel = formatMessage(
            {
              id: getTrad('onlyoffice.table.sort'),
              defaultMessage: 'Sort on {label}',
            },
            { label }
          );

          const intlLabel = formatMessage({
            id: getTrad(`onlyoffice.table.${name}`),
            defaultMessage: label,
          });

          return (
            <Th
              key={name}
              action={
                isSortable
                  ? (
                  <IconButton
                    label={sortLabel}
                    onClick={handleClickSort}
                    icon={isSorted ? <SortIcon isUp={isUp} /> : undefined}
                    noBorder
                  />
                    )
                  : undefined
              }
            >
              <Tooltip label={isSortable ? sortLabel : intlLabel}>
                <button>
                  <Typography
                    textColot='neutral600'
                    as={!isSortable && isSortable ? 'button' : 'span'}
                    onClick={() => handleClickSort(!isSorted)}
                    variant='sigma'
                  >
                    {intlLabel}
                  </Typography>
                </button>
              </Tooltip>
            </Th>
          );
        })}
      </Tr>
    </Thead>
  );
};

TableHead.defaultProps = {
  headers: [],
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
