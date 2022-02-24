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
import {
  EDIT_FORMATS,
  DOCUMENT_EXTS,
  SPREADSHEET_EXTS,
  PRESENTATION_EXTS
} from '../constants/constants';
import byteSize from 'byte-size';

module.exports = {
  isFileEditable: (ext) => {
    return EDIT_FORMATS.includes(ext);
  },

  isFileOpenable: (ext) => {
    return DOCUMENT_EXTS.concat(SPREADSHEET_EXTS).concat(PRESENTATION_EXTS).includes(ext);
  },

  getFileType: (ext) => {
    return DOCUMENT_EXTS.includes(ext) ? 'word' : SPREADSHEET_EXTS.includes(ext) ? 'cell' : PRESENTATION_EXTS.includes(ext) ? 'slide' : null;
  },

  formatBytes: (receivedBytes, decimals = 0) => {
    const {value, unit} = byteSize(receivedBytes * 1000, {precision: decimals});
    if (!unit) {
      return '0B';
    }
    return `${value}${unit.toUpperCase()}`;
  }
}
