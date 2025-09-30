# ONLYOFFICE plugin for Strapi

This plugin allows users to edit and co-author office files added to the [Strapi](https://strapi.io/) Media Library using ONLYOFFICE Docs.

## Features ⭐️

The plugin allows to:

- View and edit text documents, spreadsheets, and presentations.
- Co-edit documents in real time: two co-editing modes (Fast and Strict), Track Changes, comments, built-in chat.

## Installing ONLYOFFICE Docs

To be able to work with office files within Strapi, you will need an instance of [ONLYOFFICE Docs](https://www.onlyoffice.com/office-suite.aspx). You can install the self-hosted version of the editors or opt for ONLYOFFICE Docs Cloud which doesn't require downloading and installation.

### Self-hosted editors

You can install free Community version of ONLYOFFICE Docs or scalable Enterprise Edition.

To install free Community version, use [Docker](https://github.com/onlyoffice/Docker-DocumentServer) (recommended) or follow [these instructions](https://helpcenter.onlyoffice.com/docs/installation/docs-community-install-ubuntu.aspx) for Debian, Ubuntu, or derivatives.

To install Enterprise Edition, follow the instructions [here](https://helpcenter.onlyoffice.com/docs/installation/enterprise).

Community Edition vs Enterprise Edition comparison can be found [here](#onlyoffice-docs-editions).

### ONLYOFFICE Docs Cloud

To get ONLYOFFICE Docs Cloud, get started [here](https://www.onlyoffice.com/docs-registration.aspx).

## Plugin installation 📥

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

2. Install the plugin in your Strapi project:

   ```
   npm install onlyoffice-strapi --save
   ```

3. After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi, run:

   ```
   # using yarn
   yarn build
   yarn develop

   # using npm
   npm run build
   npm run develop
   ```

## Plugin configuration ⚙️

You can configure the ONLYOFFICE plugin via Strapi -> Settings -> ONLYOFFICE PLUGIN -> Configuration. On the settings page, enter:

- **Document server address**: The URL of the installed ONLYOFFICE Docs.
- **JWT Secret**: Starting from version 7.2, JWT is enabled by default and the secret key is generated automatically to restrict the access to ONLYOFFICE Docs and for security reasons and data integrity. Specify your own secret key on the Strapi settings page. In the ONLYOFFICE Docs [config file](https://api.onlyoffice.com/docs/docs-api/additional-api/signature/), specify the same secret key and enable the validation.

## Using ONLYOFFICE plugin for Strapi 📝

Users are able to view, edit, and co-author documents added to the Strapi Media Library. Documents available for viewing/editing can be found and sorted on the ONLYOFFICE file page within Strapi. The editor opens by clicking on the file name.

### Access rights 👥

- Opening files for editing: roles with the _Update (crop, details, replace) + delete_ permission setting.
- Opening files for viewing: roles with the _Access the Media Library_ permission setting.

## ONLYOFFICE Docs editions

ONLYOFFICE offers different versions of its online document editors that can be deployed on your own servers.

**ONLYOFFICE Docs** packaged as Document Server:

- Community Edition 🆓 (`onlyoffice-documentserver` package) – Perfect for small teams and personal use.
- Enterprise Edition 🏢 (`onlyoffice-documentserver-ee` package) – Designed for businesses with advanced features & support.

The table below will help you make the right choice.

| Pricing and licensing | Community Edition | Enterprise Edition |
| ------------- | ------------- | ------------- |
| | [Get it now](https://www.onlyoffice.com/download-community.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi#docs-enterprise)  |
| Cost  | FREE  | [Go to the pricing page](https://www.onlyoffice.com/docs-enterprise-prices.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi)  |
| Simultaneous connections | up to 20 maximum  | As in chosen pricing plan |
| Number of users | up to 20 recommended | As in chosen pricing plan |
| License | GNU AGPL v.3 | Proprietary |
| **Support** | **Community Edition** | **Enterprise Edition** |
| Documentation | [Help Center](https://helpcenter.onlyoffice.com/docs/installation/community) | [Help Center](https://helpcenter.onlyoffice.com/docs/installation/enterprise) |
| Standard support | [GitHub](https://github.com/ONLYOFFICE/DocumentServer/issues) or paid | One or three years support included |
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
| Animations                      | + | + |
| Presenter mode                  | + | + |
| Notes                           | + | + |
| Slide Master	                  | + | + |
| **Form creator features** | **Community Edition** | **Enterprise Edition** |
| Adding form fields           | + | + |
| Form preview                    | + | + |
| Saving as PDF                   | + | + |
| **PDF Editor features**      | **Community Edition** | **Enterprise Edition** |
| Text editing and co-editing	  | + | + |
| Work with pages (adding, deleting, rotating) | + | + |
| Inserting objects (shapes, images, hyperlinks, etc.) | + | + |
| Text annotations (highlight, underline, cross out) | + | + |
| Comments                        | + | + |
| Freehand drawings               | + | + |
| Form filling                    | + | + |
| | [Get it now](https://www.onlyoffice.com/download-community.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubStrapi#docs-enterprise)  |

\* If supported by DMS.

## Need help? Feedback & Support 💡

In case of technical problems, the best way to get help is to submit your issues [here](https://github.com/ONLYOFFICE/onlyoffice-strapi/issues). Alternatively, you can contact ONLYOFFICE team via [community.onlyoffice.com](https://community.onlyoffice.com) or [feedback.onlyoffice.com](https://feedback.onlyoffice.com/forums/966080-your-voice-matters).