/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import React from 'react';

const tableHeaders = [
  {
    name: 'name',
    key: 'name',
    metadatas: { label: 'Name', sortable: true },
  },
  {
    name: 'ext',
    key: 'ext',
    metadatas: { label: 'Type', sortable: true },
  },
  {
    name: 'size',
    key: 'size',
    metadatas: { label: 'Size', sortable: true },
  },
  {
    name: 'updatedAt',
    key: 'updatedAt',
    metadatas: { label: 'Last modified', sortable: true },
  },
];

export default tableHeaders;
