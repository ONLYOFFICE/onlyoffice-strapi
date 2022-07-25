/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { RelativeTime } from '@strapi/helper-plugin';
import { Flex, Typography, IconButton, Tr, Td } from '@strapi/design-system';
import {
  File as FileIcon,
  FilePdf as FilePdfIcon,
  FileError as FileErrorIcon,
  Pencil,
  Eye,
} from '@strapi/icons';

import { usePermissions } from '../../hooks';
import { getTrad, isFileEditable, isFileOpenable } from '../../utils';

const TableRow = ({ file, headers }) => {
  const { canUpdate } = usePermissions();
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();

  const supported = isFileOpenable(file.ext);
  const editable = isFileEditable(file.ext);

  const Icon = supported
    ? file.ext === 'pdf'
      ? FilePdfIcon
      : FileIcon
    : FileErrorIcon;

  const OpenIcon = editable && canUpdate ? <Pencil /> : <Eye />;
  const to = `${pathname.endsWith('/') ? pathname.slice(0, pathname.lastIndexOf('/')) : pathname}/editor?file=${file.id}`;

  return (
    <Tr>
      <Td style={{ padding: 0, margin: 0 }}>
        <Flex justifyContent='center'>
          <Icon
            height={'32px'}
            width={'32px'}
          />
        </Flex>
      </Td>
      {headers.map(({ key }) => {
        const Payload = Date.parse(file[key])
          ? <RelativeTime timestamp={new Date(file[key])} />
          : file[key];
        return (
          <Td key={key}>
            <Typography textColor='neutral800'>{Payload}</Typography>
          </Td>
        );
      })}
      <Td>
        <Flex justifyContent='flex-end'>
          {supported && (
            <IconButton
              label={formatMessage({
                id: getTrad(
                  editable && canUpdate
                    ? 'onlyoffice.label.edit'
                    : 'onlyoffice.label.open'
                ),
                defaultMessage:
                  editable && canUpdate
                    ? 'Edit in ONLYOFFICE'
                    : 'Open in ONLYOFFICE',
              })}
              noBorder
              icon={OpenIcon}
              as={NavLink}
              to={to}
            />
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

TableRow.propTypes = {
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
};

export default TableRow;
