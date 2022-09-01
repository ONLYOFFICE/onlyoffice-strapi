/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import React from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import {
  Main,
  Flex,
  ContentLayout,
  HeaderLayout,
  Button,
  Typography,
  Link,
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import {
  CheckPermissions,
  NoPermissions,
  useFocusWhenNavigate,
  LoadingIndicatorPage,
  useNotification,
} from '@strapi/helper-plugin';

import { OnlyofficeSettingsForm } from '../../components/Settings';

import permissions from '../../permissions';
import { fetchOnlyofficeSettings, useAuthentication } from '../../hooks';
import { getTrad, sanitizeURL } from '../../utils';
import { buildValidateSettings } from '../../data/validation';
import { SettingsInputScheme } from '../../data/layout';
import { pluginId, pluginDisplayName } from '../../pluginId';

const OnlyofficeSettings = () => {
  useFocusWhenNavigate();
  const dispatchNotification = useNotification();
  const { formatMessage } = useIntl();
  const { data, isLoading, isError } = fetchOnlyofficeSettings();
  const validateSettings = buildValidateSettings({
    dsURL: formatMessage({
      id: getTrad('onlyoffice.settings.errors.url'),
      defaultMessage: 'Invalid Document Server Address. Use http(s)://<domain>.<zone>',
    }),
    dsSecret: formatMessage({
      id: getTrad('onlyoffice.settings.errors.secret'),
      defaultMessage: 'Please specify Document Server JWT',
    }),
  })

  const handleSubmit = async (data) => {
    data.dsURL = sanitizeURL(data.dsURL);
    try {
      await axios.post(`/${pluginId}/settings`, data, {
        headers: useAuthentication(),
      });
      dispatchNotification({
        type: 'success',
        message: formatMessage({
          id: getTrad('onlyoffice.notification.success.submit'),
          defaultMessage: 'Settings saved successfully',
        }),
      });
      return true;
    } catch {
      dispatchNotification({
        type: 'warning',
        message: formatMessage({
          id: getTrad('onlyoffice.docserv-url.empty'),
          defaultMessage:
            'Something wrong with your settings/token. Please try again later or contact your administrator.',
        }),
      });
      return false;
    }
  };

  return (
    <Main>
      <Helmet
        title={formatMessage({
          id: getTrad('onlyoffice.settings.page.title'),
          defaultMessage: 'ONLYOFFICE plugin settings',
        })}
      />
      {isError && (
        <Flex
          alignItems='center'
          justifyContent='center'
          height='100vh'
        >
          <ContentLayout>
            <NoPermissions />
          </ContentLayout>
        </Flex>
      )}
      {isLoading && <LoadingIndicatorPage />}
      {!isLoading && !isError && (
        <CheckPermissions permissions={permissions.settings}>
          <Formik
            initialValues={data}
            onSubmit={handleSubmit}
            validate={validateSettings}
            validateOnChange={false}
          >
            {({
              values,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <OnlyofficeSettingsForm
                header={
                  <HeaderLayout
                    title={pluginDisplayName}
                    subtitle={formatMessage({
                      id: getTrad('onlyoffice.settings.page.title-sub'),
                      defaultMessage:
                        'Configure the ONLYOFFICE plugin',
                    })}
                    primaryAction={
                      <Button
                        type='submit'
                        startIcon={<Check />}
                        aria-disabled={
                          !!Object.keys(errors).length || isSubmitting
                        }
                        loading={isSubmitting}
                      >
                        {formatMessage({
                          id: getTrad('onlyoffice.save'),
                          defaultMessage: 'Save',
                        })}
                      </Button>
                    }
                  />
                }
                info={
                  <>
                    <Typography variant="delta" as="h2">
                      {formatMessage({
                        id: getTrad('onlyoffice.settings.page.content.header'),
                        defaultMessage: 'Document server configuration',
                      })}
                    </Typography>
                    <Typography>
                      {formatMessage({
                        id: getTrad('onlyoffice.settings.page.content.subheader'),
                        defaultMessage:
                          'The plugin which enables the users to edit office documents from Strapi using ONLYOFFICE Document Server,' +
                          'allows multiple users to collaborate in real time and to save back those changes to Strapi.',
                      })}
                    </Typography>
                    <div>
                      <Link href='https://github.com/ONLYOFFICE/onlyoffice-strapi'>
                        {formatMessage({
                          id: getTrad('onlyoffice.settings.page.content.more'),
                          defaultMessage: 'LEARN MORE',
                        })}
                      </Link>
                    </div>
                  </>
                }
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
        </CheckPermissions>
      )}
    </Main>
  );
};

export default OnlyofficeSettings;
