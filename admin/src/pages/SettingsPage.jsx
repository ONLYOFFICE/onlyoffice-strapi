/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import {
  Main,
  Flex,
  Button,
  Typography,
  Link,
  Box,
} from '@strapi/design-system';
import { Check, ArrowRight } from '@strapi/icons';
import { Page, useNotification, Layouts } from '@strapi/strapi/admin';

import SettingsForm from '../components/SettingsForm';

import { fetchSettings, useAuthentication } from '../hooks';

import { getTrad, sanitizeURL } from '../utils';

import { buildValidateSettings } from '../data/validation';
import { SettingsInputScheme } from '../data/layout';

import permissions from '../permissions';

import { PLUGIN_ID } from '../pluginId';

const SettingsHeader = ({ formatMessage, errors, isSubmitting, handleSubmit, isValid, values }) => (
  <Layouts.Header
    title="ONLYOFFICE"
    subtitle={formatMessage({
      id: getTrad('settings.page.title-sub'),
      defaultMessage: 'Configure the ONLYOFFICE plugin',
    })}
    primaryAction={
      <Button
        type='submit'
        startIcon={<Check />}
        disabled={!isValid || isSubmitting || !values.dsURL || !values.dsSecret}
        loading={isSubmitting}
        onClick={handleSubmit}
      >
        {formatMessage({
          id: getTrad('save'),
          defaultMessage: 'Save',
        })}
      </Button>
    }
  />
);

SettingsHeader.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
};

const SettingsInfo = ({ formatMessage }) => (
  <>
    <Typography variant="delta" tag="h2">
      {formatMessage({
        id: getTrad('settings.page.content.header'),
        defaultMessage: 'Document server configuration',
      })}
    </Typography>
    <Box paddingTop={3}>
      <Typography>
        {formatMessage({
          id: getTrad('settings.page.content.subheader'),
          defaultMessage:
            'The plugin which enables the users to edit office documents from Strapi using ONLYOFFICE Document Server,' +
            'allows multiple users to collaborate in real time and to save back those changes to Strapi.',
        })}
      </Typography>
      <Box paddingTop={1}>
        <Link
          href='https://github.com/ONLYOFFICE/onlyoffice-strapi'
          endIcon={<ArrowRight />}
          style={{ fontSize: '11px' }}
        >
          {formatMessage({
            id: getTrad('settings.page.content.more'),
            defaultMessage: 'Learn more',
          })}
        </Link>
      </Box>
    </Box>
  </>
);

SettingsInfo.propTypes = {
  formatMessage: PropTypes.func.isRequired,
};

const SettingsFormWrapper = ({ data, formatMessage, toggleNotification, authHeaders }) => {
  const validateSettings = buildValidateSettings({
    dsURL: formatMessage({
      id: getTrad('settings.errors.url'),
      defaultMessage: 'Invalid Document Server Address. Use http(s)://<domain>.<zone>',
    }),
    dsSecret: formatMessage({
      id: getTrad('settings.errors.secret'),
      defaultMessage: 'Please specify Document Server JWT',
    }),
  });

  const handleSubmit = async (formData) => {
    const sanitizedData = { ...formData, dsURL: sanitizeURL(formData.dsURL) };

    try {
      await axios.post(`/${PLUGIN_ID}/settings`, sanitizedData, {
        headers: authHeaders,
      });

      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: getTrad('notification.success.submit'),
          defaultMessage: 'Settings saved successfully',
        }),
      });
      return true;
    } catch {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: getTrad('docserv-url.empty'),
          defaultMessage:
            'Something wrong with your settings/token. Please try again later or contact your administrator.',
        }),
      });
      return false;
    }
  };

  return (
    <Formik
      initialValues={data || {}}
      onSubmit={handleSubmit}
      validate={validateSettings}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        isValid,
      }) => (
        <SettingsForm
          header={
            <SettingsHeader
              formatMessage={formatMessage}
              errors={errors}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              isValid={isValid}
              values={values}
            />
          }
          info={<SettingsInfo formatMessage={formatMessage} />}
          scheme={SettingsInputScheme}
          values={values}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Formik>
  );
};

SettingsFormWrapper.propTypes = {
  data: PropTypes.object,
  formatMessage: PropTypes.func.isRequired,
  toggleNotification: PropTypes.func.isRequired,
  authHeaders: PropTypes.object.isRequired,
};

const SettingsPage = () => {
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const { data, isLoading, isError } = fetchSettings();
  const authHeaders = useAuthentication();

  if (isError) {
    return (
      <Main>
        <Flex alignItems="center" justifyContent="center" height="100vh">
          <Layouts.Content>
            <Page.NoPermissions />
          </Layouts.Content>
        </Flex>
      </Main>
    );
  }

  if (isLoading) {
    return (
      <Main>
        <Page.Loading />
      </Main>
    );
  }

  return (
    <Main>
      <Helmet
        title={formatMessage({
          id: getTrad('settings.page.title'),
          defaultMessage: 'ONLYOFFICE plugin settings',
        })}
      />
      <Page.Protect permissions={permissions.settings}>
        <SettingsFormWrapper
          data={data}
          formatMessage={formatMessage}
          toggleNotification={toggleNotification}
          authHeaders={authHeaders}
        />
      </Page.Protect>
    </Main>
  );
};

export default SettingsPage;
