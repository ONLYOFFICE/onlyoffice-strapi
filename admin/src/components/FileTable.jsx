/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { NavLink, useLocation } from 'react-router-dom';

import { Table, IconButton, Typography, Tbody, Tr, Td } from '@strapi/design-system';
import { Page } from '@strapi/strapi/admin';
import {
  FileError,
  Pencil,
  Eye,
} from '@strapi/icons';

import FileWord from './FileWord';
import FileCell from './FileCell';
import FileSlide from './FileSlide';
import FilePdf from './FilePdf';
import FileGeneric from './FileGeneric';

import TableHead from './FileTableHeader';
import TableRow from './FileTableRow';

import { usePermissions } from '../hooks';
import { getTrad, isFileEditable, isFileOpenable, getFileIconType } from '../utils';

const EmptyState = ({ colSpan, isLoading }) => {
  const { formatMessage } = useIntl();

  return (
    <Tbody>
      <Tr>
        <Td colSpan={colSpan} style={{ textAlign: 'center', padding: '40px' }}>
          {isLoading
            ? (
            <Page.Loading />
              )
            : (
            <Typography variant="omega" textColor="neutral600">
              {formatMessage({
                id: getTrad('table.empty'),
                defaultMessage: 'No files available',
              })}
            </Typography>
              )}
        </Td>
      </Tr>
    </Tbody>
  );
};

EmptyState.propTypes = {
  colSpan: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
};

const ActionButton = ({ label, to, children }) => {
  return (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      <IconButton label={label}>
        {children}
      </IconButton>
    </NavLink>
  );
};

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const FileTable = ({ headers, isLoading = false, rows = [] }) => {
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();
  const { canUpdate } = usePermissions();

  const getFileIcon = (ext) => {
    if (!isFileOpenable(ext)) return FileError;
    if (ext === 'pdf') return FilePdf;
    const iconType = getFileIconType(ext);
    switch (iconType) {
      case 'word':
        return FileWord;
      case 'cell':
        return FileCell;
      case 'slide':
        return FileSlide;
      default:
        return FileGeneric;
    }
  };

  const getActionIcon = (ext) => {
    return isFileEditable(ext) && canUpdate ? Pencil : Eye;
  };

  const getActionLabel = (ext) => {
    const isEditable = isFileEditable(ext) && canUpdate;
    return formatMessage({
      id: getTrad(isEditable ? 'label.edit' : 'label.open'),
      defaultMessage: isEditable ? 'Edit in ONLYOFFICE' : 'Open in ONLYOFFICE',
    });
  };

  const getEditorPath = (fileId) => {
    const basePath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    return `${basePath}/editor?file=${fileId}`;
  };

  return (
    <Table rowCount={rows.length + 1} colCount={headers.length + 1}>
      {(!rows.length || isLoading)
        ? (
        <EmptyState colSpan={headers.length + 1} isLoading={isLoading} />
          )
        : (
        <>
          <TableHead headers={headers} />
          <Tbody>
            {rows.map((row) => {
              const FileIcon = getFileIcon(row.ext);
              const ActionIcon = getActionIcon(row.ext);

              return (
                <TableRow
                  key={row.hash}
                  icon={<FileIcon height="32px" width="32px" />}
                  file={row}
                  headers={headers}
                  action={
                    <ActionButton
                      label={getActionLabel(row.ext)}
                      to={getEditorPath(row.id)}
                    >
                      <ActionIcon />
                    </ActionButton>
                  }
                />
              );
            })}
          </Tbody>
        </>
          )}
    </Table>
  );
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
      id: PropTypes.string,
      ext: PropTypes.string,
      size: PropTypes.string,
    })
  ),
};

export default FileTable;
