/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import { createSelector } from 'reselect';
import pluginId from '../../pluginId';
import { initialState } from './reducer';

const onlyofficeEditor = () => state =>
  state[`${pluginId}_onlyofficeEditor`] || initialState;

const makeSelectOnlyofficeEditor = () =>
  createSelector(onlyofficeEditor(), substate => {
    return substate;
  });

export default makeSelectOnlyofficeEditor;
