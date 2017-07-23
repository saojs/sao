const langs = [
  { title: 'English', path: '/' },
  { title: '简体中文', path: '/zh/' }
]

const exploreSource = 'https://raw.githubusercontent.com/egoist/awesome-sao/master/README.md'

docute.init({
  title: 'SAO',
  repo: 'egoist/sao',
  'edit-link': 'https://github.com/egoist/sao/tree/master/docs',
  twitter: 'rem_rin_rin',
  nav: {
    default: [
      { title: 'Home', path: '/' },
      {
        title: 'Template',
        type: 'dropdown',
        items: [
          {title: 'Create template', path: '/create'},
          {title: 'Explore templates', path: '/explore', source: exploreSource}
        ]
      },
      { title: 'Advanced', type: 'dropdown', items: [{
        title: 'Writing Tests',
        path: '/advanced/test'
      }] },
      { title: 'Choose language', type: 'dropdown', items: langs }
    ],
    zh: [
      { title: '首页', path: '/zh/' },
      { title: '创建一个模板', path: '/zh/create' },
      { title: '选择语言', type: 'dropdown', items: langs }
    ]
  }
})
