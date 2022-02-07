/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
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

import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {NotFound} from '@strapi/helper-plugin';
import { Helmet } from 'react-helmet';

// Utils
import pluginId from '../../pluginId';
// Containers
import HomePage from '../HomePage';
import Editor from '../Editor';

const App = () => {
  return (
    <>
      <Helmet title={'ONLYOFFICE'} />
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact/>
        <Route path={`/plugins/${pluginId}/editor`} component={Editor} exact/>
        <Route component={NotFound}/>
      </Switch>
    </>
  );
};

export default App;
