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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';

const StartBlockActions = styled(Flex)`
  & > * + * {
    margin-left: ${({ theme }) => theme.spaces[2]};
  }
  margin-left: ${({ pullRight }) => (pullRight ? 'auto' : undefined)};
  color: #666687;
`;

const EndBlockActions = styled(StartBlockActions)`
  flex-shrink: 0;
`;

const CenterActionLayout = ({ startActions, endActions }) => {
  return startActions || endActions ? (
    <Box paddingLeft={10} paddingRight={10}>
      <Box paddingBottom={4}>
        <Flex justifyContent="space-between" alignItems="center">
          {startActions && <StartBlockActions wrap="wrap">{startActions}</StartBlockActions>}
          {endActions && <EndBlockActions pullRight>{endActions}</EndBlockActions>}
        </Flex>
      </Box>
    </Box>
  ) : null;
};

CenterActionLayout.defaultProps = {
  endActions: undefined,
  startActions: undefined,
};

CenterActionLayout.propTypes = {
  endActions: PropTypes.node,
  startActions: PropTypes.node,
};

export default CenterActionLayout;
