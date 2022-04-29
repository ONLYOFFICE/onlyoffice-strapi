/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import reducer from './pages/HomePage/reducer';
import pluginId from './pluginId';

const reducers = {
  [`${pluginId}_onlyofficeEditor`]: reducer
};

export default reducers;
