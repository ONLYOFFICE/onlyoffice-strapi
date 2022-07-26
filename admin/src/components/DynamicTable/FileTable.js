/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { NavLink, useLocation } from 'react-router-dom';

import { Table, IconButton } from '@strapi/design-system';
import { EmptyBodyTable } from '@strapi/helper-plugin';
import {
  File as FileIcon,
  FilePdf as FilePdfIcon,
  FileError as FileErrorIcon,
  Pencil,
  Eye,
} from '@strapi/icons';

import TableHead from './Header';
import TableRow from './Row';

import { usePermissions } from '../../hooks';
import { getTrad, isFileEditable, isFileOpenable } from '../../utils';

const FileTable = ({ headers, isLoading, rows }) => {
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();
  const { canUpdate } = usePermissions();
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
          const supported = isFileOpenable(row.ext);
          const editable = isFileEditable(row.ext);
          const to = `${pathname.endsWith('/') ? pathname.slice(0, pathname.lastIndexOf('/')) : pathname}/editor?file=${row.id}`;

          const Icon = supported
            ? row.ext === 'pdf'
              ? FilePdfIcon
              : FileIcon
            : FileErrorIcon;

          return (
            <TableRow
              key={row.hash}
              icon={(
                <Icon
                  height={'32px'}
                  width={'32px'}
                />
              )}
              file={row}
              headers={headers}
              action={(
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
                  icon={editable && canUpdate ? <Pencil /> : <Eye />}
                  as={NavLink}
                  to={to}
                />
              )}
            />
          );
        })}
    </Table>
  );
};

FileTable.defaultProps = {
  isLoading: false,
  rows: [],
};

FileTable.propTypes = {
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

export default FileTable;
