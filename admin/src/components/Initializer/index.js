/**
 *
 * Initializer
 *
 */
/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const Initializer = ({ setPlugin }) => {
  const ref = useRef();
  ref.current = setPlugin;

  useEffect(() => {
    ref.current(pluginId);
  }, []);

  return null;
};

Initializer.propTypes = {
  setPlugin: PropTypes.func.isRequired,
};

export default Initializer;
