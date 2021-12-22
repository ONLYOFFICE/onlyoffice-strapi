/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { auth } from 'strapi-helper-plugin';
import Editor from '../Editor';
import pluginId from '../../pluginId';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState([]);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://nsenz.xyz/web-apps/apps/api/documents/api.js";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const isFileSupported = (ext) => {
    return ext === '.docx' ? true : ext === '.pptx' ? true : ext === '.xlsx' ? true : false;
  }
  
  const updateFiles = () => {
    fetch(`${window.strapi.backendURL}/upload/files`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.getToken()}`, 
      },
    }).then((res) => {
      return res.json();
    }).then((res) => {
      const tmp = [];
      res.forEach((file) => {
        if (isFileSupported(file.ext)) {
          tmp.push(file);
        }
      });
      setFiles([...files, ...tmp]);
      setIsLoading(false);
  })
}
  

  useEffect(() => {
    let refreshInterval;
    setFiles([]);
    if (!isEditor) {
      updateFiles();
      setIsLoading(true);
      refreshInterval = setInterval(() => {
        updateFiles();
      }, 5000);
    }

    return () => clearInterval(refreshInterval);
  }, [isEditor]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1 onClick={() => setIsEditor(false)}>{pluginId}&apos;s HomePage</h1>
          {isEditor && url ? (
            <Editor url={url} name={fileName} />
          ) : (
            <table>
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Type</td>
                  <td>Updated</td>
                  <td>Edit</td>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => {
                  return (
                    <tr key={file.id}>
                      <td>{file.name}</td>
                      <td>{'office'}</td>
                      <td>{file.updated_at}</td>
                      <td><button onClick={() => {
                        setUrl(file.url);
                        setFileName(file.name);
                        setIsEditor(true);
                      }}>Open {file.name} in ONLYOFFICE</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default memo(HomePage);
