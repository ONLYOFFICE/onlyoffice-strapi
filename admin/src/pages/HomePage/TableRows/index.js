/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
import React from 'react';
import {useIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {onRowClick, RelativeTime} from '@strapi/helper-plugin';
import {Flex} from '@strapi/design-system/Flex';
import {Typography} from '@strapi/design-system/Typography';
import {Tbody, Td, Tr} from '@strapi/design-system/Table';
import {IconButton} from '@strapi/design-system/IconButton';
import Pencil from '@strapi/icons/Pencil';
import Eye from '@strapi/icons/Eye';
import FileIcon from '@strapi/icons/File';
import FilePdfIcon from '@strapi/icons/FilePdf';
import getTrad from "../../../utils/getTrad";
import {formatBytes, isFileEditable} from '../../../utils/fileUtility';

const TableRows = ({headers, rows, openEditor}) => {
  const {formatMessage} = useIntl();

  const getFileAttr = (file, attr) => {
    switch (attr) {
      case 'name':
        return file.name;
      case 'ext':
        return file.ext.replace('.', '');
      case 'size':
        return formatBytes(file.size);
      case 'updatedAt':
        return <RelativeTime timestamp={new Date(file.updatedAt)}/>;
    }
  };

  return (
    <Tbody>
      {rows.map(file => {
        return (
          <Tr
            key={file.id}
            {...onRowClick({
              fn: () => openEditor(file)
            })}>
            <Td>
              <Flex justifyContent="flex-start">
                {file.ext === '.pdf' ? <FilePdfIcon height={'2em'} width={'2em'} /> : <FileIcon height={'2em'} width={'2em'} />}
              </Flex>
            </Td>
            {headers.map(({key, name}) => {
              return (
                <Td key={key}>
                  <Typography textColor="neutral800">{getFileAttr(file, name)}</Typography>
                </Td>
              );
            })}
            <Td>
              <Flex justifyContent="end">
                <IconButton
                  onClick={() => openEditor(file)}
                  style={{cursor: 'default'}}
                  label={formatMessage({
                      id: getTrad(isFileEditable(file.ext) ? 'onlyoffice.label.edit' : 'onlyoffice.label.open'),
                      defaultMessage: isFileEditable(file.ext) ? 'Edit in ONLYOFFICE' : 'Open in ONLYOFFICE'
                    }
                  )}
                  noBorder
                  icon={isFileEditable(file.ext) ? <Pencil/> : <Eye/>}
                />
              </Flex>
            </Td>
          </Tr>
        );
      })}
        </Tbody>
        );
      };

      TableRows.defaultProps = {
      rows: [],
      openEditor: () => {},
    };

      TableRows.propTypes = {
      headers: PropTypes.array.isRequired,
      rows: PropTypes.array,
      openEditor: PropTypes.func,
    };

      export default TableRows;
