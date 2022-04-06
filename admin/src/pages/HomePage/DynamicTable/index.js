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
import React, { Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import { Table as TableCompo } from '@strapi/design-system/Table';
import { EmptyBodyTable } from '@strapi/helper-plugin';
import TableHead from '../TableHead';

const DynamicTable = ({
                 children,
                 headers,
                 isLoading,
                 rows
               }) => {
  const ROW_COUNT = rows.length + 1;
  const COL_COUNT = headers.length + 1;

  return (
    <>
      <TableCompo colCount={COL_COUNT} rowCount={ROW_COUNT}>
        <TableHead
          headers={headers}
        />
        {!rows.length || isLoading ? (
          <EmptyBodyTable
            colSpan={COL_COUNT}
            isLoading={isLoading}
          />
        ) : (
          Children.toArray(children).map(child =>
            cloneElement(child, {
              headers,
              rows
            })
          )
        )}
      </TableCompo>
    </>
  );
};

DynamicTable.defaultProps = {
  children: undefined,
  headers: [],
  isLoading: false,
  rows: []
};

DynamicTable.propTypes = {
  children: PropTypes.node,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      cellFormatter: PropTypes.func,
      key: PropTypes.string.isRequired,
      metadatas: PropTypes.shape({
        label: PropTypes.string.isRequired,
        sortable: PropTypes.bool,
      }).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  rows: PropTypes.array
};

export default DynamicTable;
