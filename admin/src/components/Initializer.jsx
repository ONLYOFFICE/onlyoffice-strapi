/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { PLUGIN_ID } from '../pluginId';

/**
 * @type {import('react').FC<{ setPlugin: (id: string) => void }>}
 */
const Initializer = ({ setPlugin }) => {
  const ref = useRef(setPlugin);

  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);

  return null;
};

Initializer.propTypes = {
  setPlugin: PropTypes.func.isRequired,
};

export { Initializer };
