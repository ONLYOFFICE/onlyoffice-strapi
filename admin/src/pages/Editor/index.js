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
import React, {useEffect, useState} from "react";
import {useNotification, LoadingIndicatorPage} from "@strapi/helper-plugin";
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
  const [favicon, setFavicon] = useState(null);
  const [config, setConfig] = useState(null);

  const toggleNotification = useNotification();

  useEffect(() => {
    const getEditorConfig = async () => {
      await axiosInstance.get(`/${pluginId}/editorConfig/${editorFile.id}`)
        .then((res) => {
          setConfig(res.data);
          setFavicon(res.data.documentType === 'cell' ? cell : res.data.documentType === 'slide' ? slide : word);
        })
        .catch(() => {
          const message = formatMessage({
            id: getTrad('onlyoffice.editor.config.error'),
            defaultMessage: 'Error getting editor config',
          })
          toggleNotification({
            type: 'warning',
            message: message,
          });
        });
    };
    getEditorConfig();
  }, []);

  useEffect(() => {
    let docEditor = null;
    const userCanEdit = editorPermissions.canEdit;

    if (config) {
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
    }
    return () => {
      if (docEditor !== null) {
        docEditor.destroyEditor();
      }
    }
  }, [editorFile, config]);

  if (!config) return <LoadingIndicatorPage/>;

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
