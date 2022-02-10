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
import React, {useEffect} from "react";
import {auth, useNotification} from "@strapi/helper-plugin";
import jwt from "jsonwebtoken";
import {isFileEditable, getFileType} from '../../utils/fileUtility';
import getTrad from "../../utils/getTrad";
import {Helmet} from 'react-helmet';
import PropTypes from "prop-types";
import pluginId from '../../pluginId';
import makeSelectOnlyofficeEditor from "../../pages/HomePage/selectors";
import {compose} from "redux";
import {connect} from 'react-redux';
import {Redirect} from "react-router-dom";
import cell from '../../assets/cell.ico';
import word from '../../assets/word.ico';
import slide from '../../assets/slide.ico';
import axiosInstance from "../../utils/axiosInstance";
import {useIntl} from "react-intl";

const EditorComponent = ({editorFile, docServConfig, editorPermissions}) => {
  const {formatMessage} = useIntl();

  if (!docServConfig.docServUrl) {
    return <Redirect to={`/plugins/${pluginId}`}/>
  }
  const documentType = getFileType(editorFile.ext);
  const favicon = documentType === 'cell' ? cell : documentType === 'slide' ? slide : word;

  const toggleNotification = useNotification();
  const fileDataForCallback = {
    id: editorFile.id,
    caption: editorFile.caption,
    name: editorFile.name,
    alternativeText: editorFile.alternativeText
  }

  useEffect(() => {
    let docEditor = null;
    const url = `${strapi.backendURL || window.location.origin}${editorFile.url}?token=${auth.getToken()}`;
    const userData = auth.getUserInfo();
    const userCanEdit = editorPermissions.canEdit;
    const fileEditable = isFileEditable(editorFile.ext);

    const docKey = editorFile.hash + new Date(editorFile.updatedAt).getTime().toString();
    const config = {
      documentType: documentType,
      document: {
        fileType: editorFile.ext.replace('.', ''),
        key: docKey,
        title: editorFile.name,
        url: url,
        permissions: {
          edit: userCanEdit && fileEditable
        }
      },
      editorConfig: {
        mode: userCanEdit && fileEditable ? 'edit' : 'view',
        callbackUrl: `${strapi.backendURL || window.location.origin}/${pluginId}/callback?token=${auth.getToken()}&fileInfo=${JSON.stringify(fileDataForCallback)}`,
        user: {
          id: userData.id.toString(),
          name: `${userData.firstname} ${userData.lastname}`
        },
        lang: auth.getUserInfo().preferedLanguage || 'en',
        customization: {
          forcesave: false
        }
      },
    };

    if (docServConfig.docJwtSecret !== '') {
      config.token = jwt.sign(config, docServConfig.docJwtSecret);
    }

    setTimeout(() => {
      const innerAlert = (message, inEditor) => {
        if (console && console.log)
          console.log(message);
        if (inEditor && docEditor)
          docEditor.showMessage(message);
      };
      const onAppReady = () => {  // the application is loaded into the browser
        innerAlert("Document editor ready");
      };

      const onError = (event) => {  // an error or some other specific event occurs
        if (event)
          innerAlert(event.data);
      };

      const onRequestSaveAs = (event) => {  //  the user is trying to save file by clicking Save Copy as... button
        const data = {
          url: event.data.url,
          title: event.data.title
        }
        axiosInstance.post(`/${pluginId}/editorApi/saveas`, data)
          .then(() => {
            const message = formatMessage({
                id: getTrad('onlyoffice.editor.save-as'),
                defaultMessage: 'Document was successfully saved',
              },
              {filename: data.title}
            )
            toggleNotification({
              type: 'success',
              message: message,
            });
          })
          .catch(() => {
            toggleNotification({
              type: 'warning',
              message: {id: getTrad('onlyoffice.editor.save-as.error')},
            });
          });
      };

      config.events = {
        'onAppReady': onAppReady,
        'onError': onError
      };

      if (userCanEdit) config.events.onRequestSaveAs = onRequestSaveAs;

      try {
        docEditor = new window.DocsAPI.DocEditor('onlyoffice-editor', config);
      } catch (e) {
        toggleNotification({
          type: 'warning',
          message: {id: getTrad('onlyoffice.notification.api.unreachable')},
        });
        return <Redirect to={`/plugins/${pluginId}`}/>
      }
    }, 100);
    return () => {
      if (docEditor !== null) {
        docEditor.destroyEditor();
      }
    }
  }, [editorFile]);

  return (
    <>
      <Helmet
        link={[
          { rel: 'shortcut icon', type: 'image/x-icon', href: `${favicon}` }
        ]}
        script={[
          {
            src: `${docServConfig.docServUrl}${docServConfig.docServUrl.charAt(docServConfig.docServUrl.length - 1) === '/' ? '' : '/'}web-apps/apps/api/documents/api.js`,
          },
        ]}>
      </Helmet>
      <div className="onlyoffice-custom" style={{width: '100%', height: '99.9vh', position: 'relative', zIndex: '1'}}>
        <div id="onlyoffice-editor"/>
      </div>
    </>
  );
};

EditorComponent.defaultProps = {
  editorFile: {},
  docServConfig: {},
  editorPermissions: {}
};

EditorComponent.propTypes = {
  editorFile: PropTypes.object.isRequired,
  docServConfig: PropTypes.object.isRequired,
  editorPermissions: PropTypes.object.isRequired
};

const mapStateToProps = makeSelectOnlyofficeEditor();
const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(EditorComponent);
