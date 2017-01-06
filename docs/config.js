var langs = [
  {title: 'English', path: '/'},
  {title: '简体中文', path: '/zh/'}
]

var exploreSource = 'https://raw.githubusercontent.com/egoist/awesome-sao/master/README.md'

self.$config = {
  title: 'SAO',
  repo: 'egoist/sao',
  'edit-link': 'https://github.com/egoist/sao/tree/master/docs',
  twitter: 'rem_rin_rin',
  nav: {
    default: [
      {title: 'Home', path: '/'},
      {title: 'Creating a template', path: '/create'},
      {title: 'Exploring templates', path: '/explore', source: exploreSource},
      {title: 'Choose language', type: 'dropdown', items: langs}
    ],
    zh: [
      {title: '首页', path: '/zh/'},
      {title: '创建一个模板', path: '/zh/create'},
      {title: '选择语言', type: 'dropdown', items: langs}
    ]
  }
}
