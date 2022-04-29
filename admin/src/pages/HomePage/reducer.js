/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import produce from 'immer';
import * as actions from './constants';

const initialState = {
  editorFileId: null,
  editorUrl: '',
  isLoading: true,
  editorPermissions: {}
};

const reducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draftState => {
    switch (action.type) {
      case actions.SET_EDITOR_PERMISSIONS: {
        draftState.editorPermissions = action.editorPermissions;
        break;
      }
      case actions.GET_EDITOR_SETTINGS_SUCCEEDED: {
        draftState.editorUrl = action.editorUrl;
        draftState.isLoading = false;
        break;
      }
      case actions.SET_EDITOR_FILE: {
        draftState.editorFileId = action.editorFileId;
        break;
      }
      case actions.RESET_EDITOR_FILE: {
        draftState.editorFileId = null;
        break;
      }
      default:
        return draftState;
    }
  });

export default reducer;
export { initialState };
