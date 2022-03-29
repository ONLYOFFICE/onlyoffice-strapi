# Strapi ONLYOFFICE integration plugin

This app enables users to edit office documents from [Strapi](https://strapi.io/) using ONLYOFFICE Docs packaged as Document Server - [Community or Enterprise Edition](#onlyoffice-docs-editions).

## Features

The app allows to:

* View and edit text documents, spreadsheets, and presentations.
* Co-edit documents in real-time using two co-editing modes (Fast and Strict), Track Changes, comments, built-in chat.

## Installing ONLYOFFICE Docs

You will need an instance of ONLYOFFICE Docs (Document Server). You can install free Community version or scalable Enterprise Edition.

To install free Community version, use [Docker](https://github.com/onlyoffice/Docker-DocumentServer) (recommended) or follow [these instructions](https://helpcenter.onlyoffice.com/installation/docs-community-install-ubuntu.aspx) for Debian, Ubuntu, or derivatives.

To install Enterprise Edition, follow the instructions [here](https://helpcenter.onlyoffice.com/installation/docs-enterprise-index.aspx).

Community Edition vs Enterprise Edition comparison can be found [here](#onlyoffice-docs-editions).

## Installing Strapi ONLYOFFICE integration plugin

1. You need to change the Strapi middlewares file: `strapi/config/middlewares.js`.
   
   To allow inserting a frame with the editor and loading api.js, replace the `strapi::security` line in this file with the following:

   ```
   {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "https:", "http:"],
          "frame-src": ["'self'", "https:", "http:"],
          },
        },
      },
    },
    ```

   If such a config already exists, you just need to add `directives`.

2. In the same strapi/config folder, add the following to plugins.js:

   ```
   module.exports = {
  'onlyoffice-strapi': {
    enabled: true,
    resolve: './src/plugins/onlyoffice-strapi'
    },
   }

   ```
   
   If the `module.exports = {...}` element already exists, add the following inside it:

   ```
   'onlyoffice-strapi': {
    enabled: true,
    resolve: './src/plugins/onlyoffice-strapi'
   },
   ```

3. Add the Strapi ONLYOFFICE integration plugin to the **strapi/src/plugins** folder. The plugin folder should be named as **onlyoffice-strapi**. Then, run the `yarn install` command in this folder.

4. Run `yarn install` and `yarn build` in the Strapi root. To launch it, run `yarn develop` or `yarn start`.  

## Configuring Strapi ONLYOFFICE integration plugin

You can configure ONLYOFFICE app via Strapi Dashboard -> Settings -> Global settings -> ONLYOFFICE. On the settings page, enter:

* **Document server address**: The URL of the installed ONLYOFFICE Document Server.
* **Document server JWT secret key**: Enables JWT to protect your documents from unauthorized access (further information can be found [here](https://api.onlyoffice.com/editors/signature/)).

## Using Strapi ONLYOFFICE integration plugin

Users are able to view, edit, and co-author documents added to the Strapi Media Library. Documents available for viewing/editing can be found and sorted on the ONLYOFFICE file page within Strapi. The editor opens by clicking on the file name.

**Access rights**

* Opening files for editing: roles with the *Update (crop, details, replace) + delete* permission setting.
* Opening files for viewing: roles with the *Access the Media Library* permission setting.

## ONLYOFFICE Docs editions 

ONLYOFFICE offers different versions of its online document editors that can be deployed on your own servers.

**ONLYOFFICE Docs** packaged as Document Server: 

* Community Edition (`onlyoffice-documentserver` package)
* Enterprise Edition (`onlyoffice-documentserver-ee` package)

The table below will help you make the right choice.

| Pricing and licensing | Community Edition | Enterprise Edition |
| ------------- | ------------- | ------------- |
| | [Get it now](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi#docs-enterprise)  |
| Cost  | FREE  | [Go to the pricing page](https://www.onlyoffice.com/docs-enterprise-prices.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi)  |
| Simultaneous connections | up to 20 maximum  | As in chosen pricing plan |
| Number of users | up to 20 recommended | As in chosen pricing plan |
| License | GNU AGPL v.3 | Proprietary |
| **Support** | **Community Edition** | **Enterprise Edition** |
| Documentation | [Help Center](https://helpcenter.onlyoffice.com/installation/docs-community-index.aspx) | [Help Center](https://helpcenter.onlyoffice.com/installation/docs-enterprise-index.aspx) |
| Standard support | [GitHub](https://github.com/ONLYOFFICE/DocumentServer/issues) or paid | One year support included |
| Premium support | [Contact us](mailto:sales@onlyoffice.com) | [Contact us](mailto:sales@onlyoffice.com) |
| **Services** | **Community Edition** | **Enterprise Edition** |
| Conversion Service                | + | + |
| Document Builder Service          | + | + |
| **Interface** | **Community Edition** | **Enterprise Edition** |
| Tabbed interface                       | + | + |
| Dark theme                             | + | + |
| 125%, 150%, 175%, 200% scaling         | + | + |
| White Label                            | - | - |
| Integrated test example (node.js)      | + | + |
| Mobile web editors                     | - | +* |
| **Plugins & Macros** | **Community Edition** | **Enterprise Edition** |
| Plugins                           | + | + |
| Macros                            | + | + |
| **Collaborative capabilities** | **Community Edition** | **Enterprise Edition** |
| Two co-editing modes              | + | + |
| Comments                          | + | + |
| Built-in chat                     | + | + |
| Review and tracking changes       | + | + |
| Display modes of tracking changes | + | + |
| Version history                   | + | + |
| **Document Editor features** | **Community Edition** | **Enterprise Edition** |
| Font and paragraph formatting   | + | + |
| Object insertion                | + | + |
| Adding Content control          | + | + | 
| Editing Content control         | + | + | 
| Layout tools                    | + | + |
| Table of contents               | + | + |
| Navigation panel                | + | + |
| Mail Merge                      | + | + |
| Comparing Documents             | + | + |
| **Spreadsheet Editor features** | **Community Edition** | **Enterprise Edition** |
| Font and paragraph formatting   | + | + |
| Object insertion                | + | + |
| Functions, formulas, equations  | + | + |
| Table templates                 | + | + |
| Pivot tables                    | + | + |
| Data validation           | + | + |
| Conditional formatting          | + | + |
| Sparklines                   | + | + |
| Sheet Views                     | + | + |
| **Presentation Editor features** | **Community Edition** | **Enterprise Edition** |
| Font and paragraph formatting   | + | + |
| Object insertion                | + | + |
| Transitions                     | + | + |
| Presenter mode                  | + | + |
| Notes                           | + | + |
| **Form creator features** | **Community Edition** | **Enterprise Edition** |
| Adding form fields           | + | + |
| Form preview                    | + | + |
| Saving as PDF                   | + | + |
| | [Get it now](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi#docs-enterprise)  |

\* If supported by DMS.

In case of technical problems, the best way to get help is to submit your issues [here](https://github.com/ONLYOFFICE/onlyoffice-strapi/issues). Alternatively, you can contact ONLYOFFICE team on [forum.onlyoffice.com](https://forum.onlyoffice.com/).