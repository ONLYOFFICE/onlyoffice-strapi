import React, { useEffect } from "react";
import { auth } from "strapi-helper-plugin";
import jwt from "jsonwebtoken";

const EditorComponent = (props) => {
  useEffect(() => {
    const url = `https://87c8-193-176-86-172.ngrok.io${props.url}?token=${auth.getToken()}`;
    const config = {
      document: {
        fileType: props.name.split('.')[1],
        key: new Date().getTime().toString(),
        title: props.name,
        url: url,
      },
      editorConfig: {
        callbackUrl: `https://87c8-193-176-86-172.ngrok.io/onlyoffice/callback?token=${auth.getToken()}&originalName=${props.name}`,
      },
    };
    config.token = jwt.sign(config, "super_secret");
    new window.DocsAPI.DocEditor('onlyoffice-editor', config);
  }, [props.url]);
  return (
    <div className="onlyoffice-custom" style={{width: '100%', height: '88.5vh'}}>
      <div id="onlyoffice-editor">
      </div>
    </div>
  );
};

export default EditorComponent;
