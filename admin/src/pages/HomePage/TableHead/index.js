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
import React from 'react';
import {IconButton} from '@strapi/design-system/IconButton';
import {Tooltip} from '@strapi/design-system/Tooltip';
import {Typography} from '@strapi/design-system/Typography';
import {Th, Thead, Tr} from '@strapi/design-system/Table';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import { useQueryParams, SortIcon } from '@strapi/helper-plugin';
import getTrad from "../../../utils/getTrad";

const TableHead = ({headers}) => {
  const {formatMessage} = useIntl();
  const [{query}, setQuery] = useQueryParams();
  const sort = query?.sort || '';
  const [sortBy, sortOrder] = sort.split(':');

  return (
    <Thead>
      <Tr>
        <Th/>
        {headers.map(({name, metadatas: {sortable: isSortable, label}}) => {
          const isSorted = sortBy === name;
          const isUp = sortOrder === 'ASC';
          const sortLabel = formatMessage(
            {id: getTrad('onlyoffice-strapi.table.sort'), defaultMessage: 'Sort on {label}'},
            {label}
          );
          const intlLabel = formatMessage({id: getTrad(`onlyoffice-strapi.table.${name}`), defaultMessage: label});

          const handleClickSort = (shouldAllowClick = true) => {
            if (isSortable && shouldAllowClick) {
              const nextSortOrder = isSorted && sortOrder === 'ASC' ? 'DESC' : 'ASC';
              const nextSort = `${name}:${nextSortOrder}`;

              setQuery({
                sort: nextSort,
              });
            }
          };

          return (
            <Th
              key={name}
              action={
                isSorted ? (
                  <IconButton
                    label={sortLabel}
                    onClick={handleClickSort}
                    icon={isSorted ? <SortIcon isUp={isUp}/> : undefined}
                    noBorder
                  />
                ) : undefined
              }
            >
              <Tooltip label={isSortable ? sortLabel : intlLabel}>
                <Typography
                  textColor="neutral600"
                  as={!isSorted && isSortable ? 'button' : 'span'}
                  onClick={() => handleClickSort(!isSorted)}
                  variant="sigma"
                >
                  {intlLabel}
                </Typography>
              </Tooltip>
            </Th>
          );
        })}
      </Tr>
    </Thead>
  );
};

TableHead.defaultProps = {
  headers: []
};

TableHead.propTypes = {
  headers: PropTypes.array
};

export default TableHead;
