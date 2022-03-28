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
import cell from '../../assets/cell.ico';
import word from '../../assets/word.ico';
import slide from '../../assets/slide.ico';
import axiosInstance from "../../utils/axiosInstance";
import {useIntl} from "react-intl";
import {useHistory} from "react-router";
import {Redirect} from "react-router-dom";

const EditorComponent = (props) => {
  const {editorFileId, editorUrl, editorPermissions} = props;
  const {formatMessage, locale} = useIntl();
  const {goBack} = useHistory();
  const {mediaUrl} = props.location.state;

  if (!editorUrl) {
    return <Redirect to={mediaUrl.substring(mediaUrl.indexOf(`/plugins/${pluginId}`))}/>
  }
  const [favicon, setFavicon] = useState(null);
  const [config, setConfig] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [editorIsReachable, setEditorIsReachable] = useState(false);

  const toggleNotification = useNotification();

  const showErrorAndRedirect = () => {
    toggleNotification({
      type: 'warning',
      message: {id: getTrad('onlyoffice-strapi.notification.api.unreachable')},
    });
    goBack();
  };

  useEffect(() => {
    const getEditorConfig = async () => {
      await axiosInstance.get(`/${pluginId}/editorConfig/${editorFileId}/${locale}`)
        .then((res) => {
          setEditorIsReachable(true);
          setConfig(res.data);
          setFavicon(res.data.documentType === 'cell' ? cell : res.data.documentType === 'slide' ? slide : word);
        })
        .catch((er) => {
          if (er.response.data.error.details === 'Docs API unreachable') {
            showErrorAndRedirect();
          } else {
            const message = formatMessage({
              id: getTrad('onlyoffice-strapi.editor.config.error'),
              defaultMessage: 'Error getting editor config',
            })
            toggleNotification({
              type: 'warning',
              message: message,
            });
          }
        });
    };
    getEditorConfig();
  }, []);

  useEffect(() => {
    if (editorIsReachable) {
      let interval;
      if (!scriptLoaded) {
        interval = setInterval(() => {
          if (window.DocsAPI) setScriptLoaded(true);
        }, 100);
      }
      return () => clearInterval(interval);
    }
  }, [scriptLoaded, editorIsReachable]);

  useEffect(() => {
    let docEditor = null;
    const userCanEdit = editorPermissions.canEdit;

    if (config && scriptLoaded) {
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
          .then((response) => {
            const message = formatMessage({
                id: getTrad('onlyoffice-strapi.editor.save-as'),
                defaultMessage: 'Document was successfully saved',
              },
              {filename: response.data.title}
            )
            toggleNotification({
              type: 'success',
              message: message,
            });
          })
          .catch(() => {
            toggleNotification({
              type: 'warning',
              message: {id: getTrad('onlyoffice-strapi.editor.save-as.error')},
            });
          });
      };

      config.events = {
        'onAppReady': onAppReady,
        'onError': onError
      };

      config.editorConfig.customization.goback.url = mediaUrl;
      if (/android|avantgo|playbook|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\|plucker|pocket|psp|symbian|treo|up\\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
        .test(navigator.userAgent)) {
        config.type='mobile';
      }

      if (userCanEdit) config.events.onRequestSaveAs = onRequestSaveAs;

      try {
        docEditor = new window.DocsAPI.DocEditor('onlyoffice-editor', config);
      } catch (e) {
        showErrorAndRedirect();
      }
    }
    return () => {
      if (docEditor !== null) {
        docEditor.destroyEditor();
      }
    }
  }, [editorFileId, config, scriptLoaded]);

  if (!editorIsReachable) return <LoadingIndicatorPage/>;

  return (
    <>
      {!config || !scriptLoaded && <LoadingIndicatorPage/>}
      <Helmet
        link={[
          { rel: 'shortcut icon', type: 'image/x-icon', href: `${favicon}` }
        ]}
        script={[
          {
            src: `${editorUrl}${editorUrl.charAt(editorUrl.length - 1) === '/' ? '' : '/'}web-apps/apps/api/documents/api.js`,
          },
        ]}>
      </Helmet>
      <div className="onlyoffice-custom" style={{width: '100%', height: '99.9vh', position: 'absolute', zIndex: '2', left: '0'}}>
        <div id="onlyoffice-editor"/>
      </div>
    </>
  );
};

EditorComponent.defaultProps = {
  editorFileId: null,
  editorUrl: '',
  editorPermissions: {}
};

EditorComponent.propTypes = {
  editorFileId: PropTypes.object.isRequired,
  editorUrl: PropTypes.object.isRequired,
  editorPermissions: PropTypes.object.isRequired
};

const mapStateToProps = makeSelectOnlyofficeEditor();
const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(EditorComponent);
