/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';

import { RelativeTime } from '@strapi/helper-plugin';
import { Flex, Typography, Tr, Td } from '@strapi/design-system';

import { Maybe } from '../../utils/func';

const TableRow = ({ icon, file, headers, action }) => {
  return (
    <Tr>
      <Td style={{ padding: 0, margin: 0 }}>
        <Flex justifyContent='center'>
          {icon}
        </Flex>
      </Td>
      {headers.map(({ key }) => {
        const timestamp = new Maybe(file[key])
          .bind((value) => Date.parse(value))
          .bind((date) => isNaN(date) ? null : new Date(date))
          .bind((valid) => valid ? (valid.setSeconds(valid.getSeconds() - 1), valid) : null)
          .value;

        return (
          <Td key={key}>
            <Typography textColor='neutral800'>
              {
                timestamp
                  ? <RelativeTime timestamp={timestamp} />
                  : file[key]
              }
            </Typography>
          </Td>
        );
      })}
      <Td>
        <Flex justifyContent='flex-end'>
          {action}
        </Flex>
      </Td>
    </Tr>
  );
};

TableRow.propTypes = {
  icon: PropTypes.node,
  file: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    ext: PropTypes.string,
    size: PropTypes.number,
    updatedAt: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
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
  ).isRequired,
  action: PropTypes.node,
};

export default TableRow;
