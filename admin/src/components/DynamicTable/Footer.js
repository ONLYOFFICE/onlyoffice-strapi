/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box, Flex } from '@strapi/design-system';
import { PaginationURLQuery, PageSizeURLQuery } from '@strapi/helper-plugin';

const AlignedFlex = styled(Flex)`
  align-items: flex-end;
  justify-content: space-between;
`;

const PaginationFooter = ({ pagination }) => {
  return (
    <Box paddingTop={4}>
      <AlignedFlex>
        <PageSizeURLQuery />
        <PaginationURLQuery pagination={pagination} />
      </AlignedFlex>
    </Box>
  );
};

PaginationFooter.defaultProps = {
  pagination: {
    pageCount: 0,
    pageSize: 10,
    total: 0,
  },
};

PaginationFooter.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
  }),
};

export default PaginationFooter;
