/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
module.exports = function buildMakeConfig({ getFileType, generateDocKey, isValidUrl, isFileSupported, isFileEditable }) {
  return function makeConfig({
    fileName,
    fileExt,
    url,
    callback,
    user,
    type = 'desktop',
    userCanEdit = false,
    userCanDownload = false,
    lang = 'en',
    docKey = generateDocKey(),
  }) {
    if (!fileName) {
      throw new Error('ONLYOFFICE Config expects a valid file name');
    }
    if (!fileExt || !isFileSupported(fileExt)) {
      throw new Error('ONLYOFFICE Config expects a valid/supported file extension');
    }
    if (!isValidUrl(url)) {
      throw new Error('ONLYOFFICE Config expects a valid download url');
    }
    if (!isValidUrl(callback)) {
      throw new Error('ONLYOFFICE Config expects a valid callback url');
    }
    if (!user?.id) {
      throw new Error('ONLYOFFICE Config expects a valid user id');
    }
    if (!user?.firstname) {
      throw new Error('ONLYOFFICE Config expects valid firstname');
    }

    return Object.freeze({
      documentType: getFileType(fileExt),
      document: {
        fileType: fileExt.replace('.', ''),
        key: docKey,
        title: fileName,
        url,
        permissions: {
          edit: userCanEdit && isFileEditable(fileExt),
          download: userCanDownload,
        },
      },
      editorConfig: {
        mode: userCanEdit && isFileEditable(fileExt) ? 'edit' : 'view',
        callbackUrl: callback,
        user: {
          id: user.id,
          name: `${user.firstname} ${user?.lastname}`,
        },
        lang,
        customization: {
          forcesave: false,
          goback: {
            blank: false,
            url: '',
          },
        },
      },
      type,
    });
  };
};
