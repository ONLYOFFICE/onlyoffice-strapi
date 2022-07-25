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
  HeaderLayout,
  Button,
  Typography,
  Link,
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import {
  CheckPermissions,
  useFocusWhenNavigate,
  LoadingIndicatorPage,
  useNotification,
} from '@strapi/helper-plugin';

import { OnlyofficeSettingsForm } from '../../components/Settings';

import permissions from '../../permissions';
import { fetchOnlyofficeSettings, useAuthentication } from '../../hooks';
import { getTrad, sanitizeURL } from '../../utils';
import { validateSettings } from '../../data/validation';
import { SettingsInputScheme } from '../../data/layout';
import { pluginDisplayName } from '../../pluginId';

const OnlyofficeSettings = () => {
  useFocusWhenNavigate();
  const dispatchNotification = useNotification();
  const { formatMessage } = useIntl();
  const { data, isLoading, isError } = fetchOnlyofficeSettings();

  const handleSubmit = async (data) => {
    data.dsURL = sanitizeURL(data.dsURL);
    try {
      await axios.post('/onlyoffice/settings', data, {
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

  if (isError) {
    dispatchNotification({
      type: 'warning',
      message: formatMessage({
        id: getTrad('onlyoffice.notification.api.unreachable'),
        defaultMessage: 'ONLYOFFICE cannot be reached',
      }),
    });
  }

  return (
    <Main>
      <Helmet
        title={formatMessage({
          id: getTrad('onlyoffice.settings.page.title'),
          defaultMessage: 'ONLYOFFICE plugin settings',
        })}
      />
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
