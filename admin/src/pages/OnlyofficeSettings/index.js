/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import React from "react";
import {useIntl} from 'react-intl';
import getTrad from '../../utils/getTrad';
import {
  CheckPermissions,
  Form,
  useFocusWhenNavigate,
  LoadingIndicatorPage
} from '@strapi/helper-plugin';
import {ContentLayout, HeaderLayout, ActionLayout} from '@strapi/design-system/Layout';
import {Button} from '@strapi/design-system/Button';
import {Main} from '@strapi/design-system/Main';
import {Formik} from 'formik';
import {Grid, GridItem} from '@strapi/design-system/Grid';
import { TextInput } from '@strapi/design-system/TextInput';
import {Box} from '@strapi/design-system/Box';
import schema from "./utils/schema";
import layout from "./utils/layout";
import permissions from '../../permissions';
import pluginId from '../../pluginId';
import useReactQuery from "../utils/useReactQuery";
import {useHistory, useLocation} from 'react-router-dom';
import OnlyofficeLogo from "../../components/OnlyofficeLogo";


const OnlyofficeSettingsComponent = () => {
  useFocusWhenNavigate();

  const {formatMessage} = useIntl();
  const {pathname} = useLocation();
  const {push} = useHistory();

  const {submitMutation, data, isLoading} = useReactQuery();

  const initialValues = {
    docServUrl: data?.docServConfig.docServUrl || '',
    docJwtSecret: data?.docServConfig.docJwtSecret || ''
  };

  const saveSettings = (body) => {
    submitMutation.mutate({
      body,
    });

    push({
      pathname: `${pathname.replace(`/settings/${pluginId}`, `/plugins/${pluginId}`)}`
    });
  };

  return (
    <Main>
      {isLoading ?
        <LoadingIndicatorPage/>
        :
        <CheckPermissions permissions={permissions.settings}>
          <ActionLayout startActions={
            <OnlyofficeLogo/>
          }/>
          <Formik
            initialValues={initialValues}
            onSubmit={saveSettings}
            validationSchema={schema}
            validateOnChange={false}
          >
            {({handleSubmit, values, handleChange, errors}) => {
              return (
                <Form noValidate onSubmit={handleSubmit}>
                  <HeaderLayout
                    title={formatMessage({
                      id: getTrad('onlyoffice.settings.page.title'),
                      defaultMessage: 'ONLYOFFICE plugin settings',
                    })}
                    subtitle={formatMessage({
                      id: getTrad('onlyoffice.settings.page.title-sub'),
                      defaultMessage: 'Configure the ONLYOFFICE plugin',
                    })}
                    primaryAction={
                      <Button type="submit" disabled={!(!!values.docServUrl)}>
                        {formatMessage({
                          id: getTrad('onlyoffice.save'),
                          defaultMessage: 'Save',
                        })}
                      </Button>
                    }
                  />
                  <ContentLayout>
                    <Box
                      background="neutral0"
                      hasRadius
                      shadow="filterShadow"
                      paddingTop={6}
                      paddingBottom={6}
                      paddingLeft={7}
                      paddingRight={7}
                    >
                      <Grid gap={4}>
                        {layout.map(row => {
                          return row.map(input => {
                            return (
                              <GridItem key={input.name} {...input.size}>
                                <TextInput
                                  name={input.name}
                                  required={input.required}
                                  label={formatMessage({id: getTrad(input.intlLabel.id), defaultMessage: input.intlLabel.defaultMessage })}
                                  hint={input.description ? formatMessage({id: getTrad(input.description.id), defaultMessage: input.description.defaultMessage }) : ''}
                                  error={errors[input.name]}
                                  onChange={handleChange}
                                  value={values[input.name]}
                                />
                              </GridItem>
                            );
                          });
                        })}
                      </Grid>
                    </Box>
                  </ContentLayout>
                </Form>
              )
            }}
          </Formik>
        </CheckPermissions>
      }
    </Main>
  );
};

export default OnlyofficeSettingsComponent;
