/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
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
