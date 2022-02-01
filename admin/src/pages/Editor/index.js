/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
import React, {useEffect} from "react";
import {auth, useNotification} from "@strapi/helper-plugin";
import jwt from "jsonwebtoken";
import {isFileEditable, getFileType} from '../../utils/fileUtility';
import getTrad from "../../utils/getTrad";
import {Helmet} from 'react-helmet';
import PropTypes from "prop-types";
import pluginId from '../../pluginId';

const EditorComponent = ({file, docServConfig, canEdit}) => {

  const toggleNotification = useNotification();
  const fileDataForCallback = {
    id: file.id,
    caption: file.caption,
    name: file.name,
    alternativeText: file.alternativeText
  }

  useEffect(() => {
    const url = `${strapi.backendURL || window.location.origin}${file.url}?token=${auth.getToken()}`;
    const userData = auth.getUserInfo();
    const userCanEdit = canEdit;
    const fileEditable = isFileEditable(file.ext);

    const docKey = file.hash + new Date(file.updatedAt).getTime().toString();
    const config = {
      documentType: getFileType(file.ext),
      document: {
        fileType: file.ext.replace('.', ''),
        key: docKey,
        title: file.name,
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
      try {
        new window.DocsAPI.DocEditor('onlyoffice-editor', config);
      } catch (e) {
        toggleNotification({
          type: 'warning',
          message: {id: getTrad('onlyoffice.notification.api.unreachable')},
        });
      }
    }, 100);
  }, [file]);

  return (
    <>
      <Helmet
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
  canEdit: false
};

EditorComponent.propTypes = {
  file: PropTypes.object.isRequired,
  docServConfig: PropTypes.object.isRequired,
  canEdit: PropTypes.bool,
};

export default EditorComponent;
