/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/

import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {NotFound} from '@strapi/helper-plugin';

// Utils
import pluginId from '../../pluginId';
// Containers
import HomePage from '../HomePage';
import OnlyofficeSettings from '../OnlyOfficeSettings';

const App = () => {
  return (
    <>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact/>
        <Route path={`/plugins/${pluginId}/settings`} component={OnlyofficeSettings} exact/>
        <Route component={NotFound}/>
      </Switch>
    </>
  );
};

export default App;
