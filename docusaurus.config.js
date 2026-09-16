// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Shesha',
  tagline: 'Shesha Documentation',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://docs-shesha.azurewebsites.net/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'shesha-io', // Usually your GitHub org/user name.
  projectName: 'Shesha-Framework', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.

          // Versioning. Three versions are published:
          //   v0.46 - frozen snapshot (versioned_docs/version-0.46) at /docs/0.46/...
          //   v0.45 - the "current" docs (the `docs/` folder)        at /docs/0.45/...
          //   v0.43 - frozen snapshot, served as the default version at /docs/...
          // Readers switch versions via the dropdown in the navbar.
          // Every version sets banner:'none' so no "unreleased"/"unmaintained"
          // notice is shown - all three are released and maintained.
          lastVersion: '0.43',
          versions: {
            '0.46': {
              label: '0.46',
              path: '0.46',
              banner: 'none',
            },
            current: {
              label: '0.45',
              path: '0.45',
              banner: 'none',
            },
            '0.43': {
              label: '0.43',
              banner: 'none',
            },
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/SheshaLogo.png',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        logo: {
          alt: 'My Site Logo',
          src: 'img/SheshaLogo.png',
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            type: 'search',
            position: 'left',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            // Order shown in the dropdown: newest first - v0.46, v0.45 (current), v0.43.
            versions: ['0.46', 'current', '0.43'],
          },
          {
            type: 'custom-customSearchBar', 
            position: "right",
          },
          {
            to: 'https://www.shesha.io/download-shesha',
            label: 'Try Shesha',
            position: 'right',
            style: { backgroundColor: '#1666ba', color: 'white', padding: '8px 15px', borderRadius: '5px' },
          },
          {
            href: 'https://github.com/shesha-io/shesha-framework',
            label: 'GitHub',
            position: 'right',
            iconClassName: 'feather icon-github',
          },
        ],
      },
      // footer: {
      //   style: 'dark',
      //   links: [
      //     {
      //       title: 'Docs',
      //       items: [
      //         {
      //           label: 'Tutorial',
      //           to: '/docs/intro',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Community',
      //       items: [
      //         {
      //           label: 'Stack Overflow',
      //           href: '#',
      //         },
      //         {
      //           label: 'Discord',
      //           href: '#',
      //         },
      //         {
      //           label: 'Twitter',
      //           href: '#',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'More',
      //       items: [
      //         {
      //           label: 'Blog',
      //           to: '/blog',
      //         },
      //         {
      //           label: 'GitHub',
      //           href: 'https://github.com/shesha-io/shesha-framework',
      //         },
      //       ],
      //     },
      //   ],
      //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      // },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['csharp'],
      },
    }),
  scripts: [
    {
      src:
        '/scripts/analyticsEvents.js',
      defer: true,
    },
    {
      src:
        '/scripts/hotjarTracking.js',
      defer: true,
    },
    {
      src:
        '/scripts/googleTag.js',
      defer: true,
    }
  ],
  plugins: [require.resolve('docusaurus-lunr-search')]
};

export default config;  
