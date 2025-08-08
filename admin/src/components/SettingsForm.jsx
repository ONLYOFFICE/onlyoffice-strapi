/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Flex, Box, TextInput } from '@strapi/design-system';
import { Layouts } from '@strapi/strapi/admin';
import { Form } from '@strapi/admin/strapi-admin';

import { getTrad } from '../utils';

const SettingsForm = ({
  header,
  info,
  scheme = [],
  values = {},
  errors = {},
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting = false,
  footer,
}) => {
  const { formatMessage } = useIntl();

  const renderField = (entry) => (
    <Box key={entry.name}>
      <TextInput
        name={entry.name}
        required={entry.required}
        type={entry.type}
        label={formatMessage({
          id: getTrad(entry.label.id),
          defaultMessage: entry.label.defaultMessage,
        })}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[entry.name]}
        error={errors[entry.name]}
        disabled={isSubmitting}
      />
    </Box>
  );

  return (
    <Form onSubmit={handleSubmit}>
      {header}
      <Layouts.Content>
        <Flex direction="column" gap={7}>
          <Box
            background="neutral0"
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
            style={{ borderRadius: '4px' }}
          >
            <Flex direction="column" gap={4}>
              {info && (
                <Flex direction="column" gap={1}>
                  {info}
                </Flex>
              )}
              <Flex direction="column" gap={4}>
                {scheme.map(renderField)}
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Layouts.Content>
      {footer}
    </Form>
  );
};

SettingsForm.propTypes = {
  header: PropTypes.node.isRequired,
  info: PropTypes.node,
  scheme: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      required: PropTypes.bool.isRequired,
      type: PropTypes.oneOf(['password', 'text']).isRequired,
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
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  footer: PropTypes.node,
};

export default SettingsForm;
