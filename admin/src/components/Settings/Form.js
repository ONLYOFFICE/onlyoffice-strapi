/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  Stack,
  Box,
  Grid,
  GridItem,
  TextInput,
  ContentLayout,
} from '@strapi/design-system';
import { Form } from '@strapi/helper-plugin';

import { getTrad } from '../../utils';

const SettingsForm = ({
  header,
  info,
  scheme,
  values,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  footer,
}) => {
  const { formatMessage } = useIntl();
  return (
    <Form onSubmit={handleSubmit}>
      {header}
      <ContentLayout>
        <Stack spacing={7}>
          <Box
            background='neutral0'
            hasRadius
            shadow='filterShadow'
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
          >
            <Stack spacing={4}>
              <Stack spacing={1}>
                {info}
              </Stack>
              <Grid gap={4}>
                {scheme.map((entry) => {
                  return (
                    <GridItem col={6} s={12} key={entry.name}>
                      <TextInput
                        autocomplete
                        name={entry.name}
                        required={entry.required}
                        type={entry.type}
                        label={formatMessage({
                          id: getTrad(entry.label.id),
                          defaultMessage: entry.label.defaultMessage,
                        })}
                        hint={
                          entry.description
                            ? formatMessage({
                              id: getTrad(entry.description.id),
                              defaultMessage:
                                entry.description.defaultMessage,
                            })
                            : ''
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[entry.name]}
                        error={errors[entry.name]}
                        disabled={isSubmitting}
                      />
                    </GridItem>
                  );
                })}
              </Grid>
            </Stack>
          </Box>
        </Stack>
      </ContentLayout>
      {footer}
    </Form>
  );
};

SettingsForm.defaultProps = {
  scheme: [],
  values: [],
  errors: [],
  isSubmitting: false,
};

SettingsForm.propTypes = {
  header: PropTypes.node.isRequired,
  info: PropTypes.node,
  scheme: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      required: PropTypes.bool.isRequired,
      type: PropTypes.oneOf('password', 'text').isRequired,
      label: PropTypes.shape({
        id: PropTypes.string.isRequired,
        defaultMessage: PropTypes.string.isRequired,
      }).isRequired,
      description: PropTypes.shape({
        id: PropTypes.string.isRequired,
        defaultMessage: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
  values: PropTypes.array.isRequired,
  errors: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  footer: PropTypes.node,
};

export default SettingsForm;
