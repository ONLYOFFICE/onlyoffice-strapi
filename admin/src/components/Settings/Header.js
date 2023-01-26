/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Box,
  Flex,
  IconButton,
  SimpleMenu,
  Typography,
  Link,
} from '@strapi/design-system';
import { More, ArrowLeft } from '@strapi/icons';

const AlignedBasicHeader = styled(Box)`
  margin-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 56px;
  flex-grow: 1;
`;

const SettingsHeaderTypography = styled(Typography)`
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.25;
  font-variant: 'Beta';
`;

const SettingsSubheaderTypography = styled(Typography)`
  font-size: 1rem;
  line-height: 1.5;
  font-variant: 'Epsilon';
  align-items: flex-end;
`;

const OnlyofficeSettingsHeader = ({
  backPath,
  backTo,
  logo,
  mainHeader,
  subHeader,
  action,
  moreActions,
}) => {
  return (
    <Flex paddingLeft='56px' paddingTop='40px'>
      <Flex direction='column' justifyContent='center'>
        <Link to={backPath} startIcon={<ArrowLeft />}>
          {backTo}
        </Link>
        {logo}
      </Flex>
      <AlignedBasicHeader>
        <SettingsHeaderTypography>{mainHeader}</SettingsHeaderTypography>
        <Flex alignItems='flex-end' justifyContent='space-between'>
          <SettingsSubheaderTypography textColor='neutral400'>
            {subHeader}
          </SettingsSubheaderTypography>
          <Flex>
            {action && <Box marginRight='1rem'>{action}</Box>}
            {moreActions && (
              <SimpleMenu as={IconButton} icon={<More />}>
                {moreActions}
              </SimpleMenu>
            )}
          </Flex>
        </Flex>
      </AlignedBasicHeader>
    </Flex>
  );
};

OnlyofficeSettingsHeader.defaultProps = {
  backPath: '/',
  backTo: 'Home',
  logo: null,
  action: null,
  moreActions: null,
};

OnlyofficeSettingsHeader.propTypes = {
  backPath: PropTypes.string,
  backTo: PropTypes.string,
  logo: PropTypes.node,
  mainHeader: PropTypes.string.isRequired,
  subHeader: PropTypes.string,
  action: PropTypes.node,
  moreActions: PropTypes.node,
};

export default OnlyofficeSettingsHeader;
