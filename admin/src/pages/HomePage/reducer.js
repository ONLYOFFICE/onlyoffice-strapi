import produce from 'immer';
import * as actions from './constants';

const initialState = {
  editorFile: {},
  docServConfig: {},
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
        draftState.docServConfig = action.docServConfig;
        draftState.isLoading = false;
        break;
      }
      case actions.SET_EDITOR_FILE: {
        draftState.editorFile = action.editorFile;
        break;
      }
      case actions.RESET_EDITOR_FILE: {
        draftState.editorFile = {};
        break;
      }
      default:
        return draftState;
    }
  });

export default reducer;
export { initialState };
