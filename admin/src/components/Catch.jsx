/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';

export const Catch = (component, handler = null) => {
  return class Wrapped extends React.Component {
    state = {
      error: undefined,
    };

    static getDerivedStateFromError(error) {
      return { error }
    }

    componentDidCatch(error, info) {
      if (handler) {
        handler(error, info);
      }
    };

    render() {
      return component(this.props, this.state.error);
    };
  };
};

Catch.propTypes = {
  component: PropTypes.node,
  handler: PropTypes.func,
};

export default Catch;
