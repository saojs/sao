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
        link: '/guide/getting-started'
      }
    ],
    sidebar: [
      {
        title: 'Guide',
        children: [
          '/guide/getting-started',
          '/guide/create-a-generator',
          '/guide/share-your-generator',
          '/guide/saofile',
          '/guide/the-sao-instance',
          '/guide/migrate-from-v0'
        ]
      }
    ]
  }
}
