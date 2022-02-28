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
import {formatBytes} from '../../../utils/utility';

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
              <Flex justifyContent="flex-end">
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
                      id: getTrad(file.edit ? 'onlyoffice.label.edit' : 'onlyoffice.label.open'),
                      defaultMessage: file.edit ? 'Edit in ONLYOFFICE' : 'Open in ONLYOFFICE'
                    }
                  )}
                  noBorder
                  icon={file.edit ? <Pencil/> : <Eye/>}
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
