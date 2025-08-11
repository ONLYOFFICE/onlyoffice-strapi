/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Flex, Box, TextInput, Field } from '@strapi/design-system';
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
    <Box key={entry.name} style={{ width: '100%' }}>
      <Field.Root
        name={entry.name}
        id={entry.name}
        required={entry.required}
        error={errors[entry.name]}
        hint={entry.description
          ? formatMessage({
            id: getTrad(entry.description.id),
            defaultMessage: entry.description.defaultMessage,
          })
          : undefined}
        style={{ width: '100%' }}
      >
        <Field.Label>
          {formatMessage({
            id: getTrad(entry.label.id),
            defaultMessage: entry.label.defaultMessage,
          })}
        </Field.Label>
        <TextInput
          name={entry.name}
          type={entry.type}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[entry.name]}
          disabled={isSubmitting}
          style={{ width: '100%' }}
        />
        <Box style={{ minHeight: '40px' }}>
          {entry.description && <Field.Hint />}
          <Field.Error />
        </Box>
      </Field.Root>
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
