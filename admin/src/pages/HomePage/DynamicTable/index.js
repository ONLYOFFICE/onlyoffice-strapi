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
