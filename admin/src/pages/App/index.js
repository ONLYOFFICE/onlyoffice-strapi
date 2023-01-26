/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { NotFound } from '@strapi/helper-plugin';

import HomePage from '../HomePage';
import OnlyofficeEditor from '../OnlyofficeEditor';

import { pluginId, pluginDisplayName } from '../../pluginId';

const App = () => {
  return (
    <div>
      <Helmet title={pluginDisplayName} />
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route path={`/plugins/${pluginId}/editor`} component={OnlyofficeEditor} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
