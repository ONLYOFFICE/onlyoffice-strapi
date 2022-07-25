/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Table } from '@strapi/design-system/Table';
import { EmptyBodyTable } from '@strapi/helper-plugin';

import TableHead from './Header';
import TableRow from './Row';

const DynamicTable = ({ headers, isLoading, rows }) => {
  const showEmpty = !rows.length || isLoading;
  const showRows = !!rows.length && !isLoading;

  return (
    <Table rowCount={rows.length + 1} colCount={headers.length + 1}>
      <TableHead headers={headers} />
      {showEmpty && (
        <EmptyBodyTable colSpan={headers.length + 1} isLoading={isLoading} />
      )}
      {showRows &&
        rows.map((row) => {
          return <TableRow key={row.hash} file={row} headers={headers} />;
        })}
    </Table>
  );
};

DynamicTable.defaultProps = {
  isLoading: false,
  rows: [],
};

DynamicTable.propTypes = {
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
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      hash: PropTypes.string,
    })
  ),
};

export default DynamicTable;
