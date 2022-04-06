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
