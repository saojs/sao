module.exports = {
  title: 'SAO',
  description: 'Project scaffolding for humans.',
  serviceWorker: true,
  themeConfig: {
    repo: 'saojs/sao',
    docsDir: 'docs',
    editLinks: true,
    nav: [
      {
        text: 'Guide',
        link: '/guide/introduction'
      }
    ],
    sidebar: [
      {
        title: 'Guide',
        children: [
          '/guide/introduction',
          '/guide/getting-started',
          '/guide/creating-a-generator',
          '/guide/sharing-your-generator',
          '/guide/saofile',
          '/guide/the-sao-instance',
          '/guide/migrate-from-v0'
        ]
      }
    ]
  }
}
