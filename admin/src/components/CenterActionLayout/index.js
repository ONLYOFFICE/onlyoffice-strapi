/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
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