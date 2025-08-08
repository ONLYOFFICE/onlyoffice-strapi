/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Flex, Typography, Tr, Td } from '@strapi/design-system';

const formatTimestamp = (timestamp, locale) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffInSeconds < 60) { return rtf.format(-diffInSeconds, 'second'); } else if (diffInSeconds < 3600) { return rtf.format(-Math.floor(diffInSeconds / 60), 'minute'); } else if (diffInSeconds < 86400) { return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour'); } else if (diffInSeconds < 2592000) { return rtf.format(-Math.floor(diffInSeconds / 86400), 'day'); } else if (diffInSeconds < 31536000) { return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month'); } else { return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year'); }
  } catch (error) {
    return timestamp;
  }
};

const formatCellValue = (value, key, locale) => {
  if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) {
    const timestamp = Date.parse(value);
    if (!isNaN(timestamp)) { return formatTimestamp(timestamp, locale); }
  }

  return value;
};

const TableRow = ({ icon, file, headers, action }) => {
  const { locale } = useIntl();
  return (
    <Tr>
      <Td style={{ padding: 0, margin: 0 }}>
        <Flex justifyContent="center">
          {icon}
        </Flex>
      </Td>
      {headers.map(({ key }) => (
        <Td key={key}>
          <Typography textColor="neutral800">
            {formatCellValue(file[key], key, locale)}
          </Typography>
        </Td>
      ))}
      <Td>
        <Flex justifyContent="flex-end">
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
    size: PropTypes.string,
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
