/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import byteSize from 'byte-size';

export const formatBytes = (receivedBytes, decimals = 0) => {
    const {value, unit} = byteSize(receivedBytes * 1000, {precision: decimals});
    if (!unit) {
      return '0B';
    }
    return `${value}${unit.toUpperCase()}`;
  }
