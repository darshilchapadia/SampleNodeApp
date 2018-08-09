module.exports = {
  '/blog': {
    routes: [
      {
        method: 'get',
        route: '/',
        handlers: [{
          base: 'blog',
          name: 'fetchAll'
        }]
      },
      {
        method: 'post',
        route: '/',
        handlers: [{
          base: 'blog',
          name: 'createNew'
        }]
      },
      {
        method: 'get',
        route: '/:blogId',
        handlers: [{
          base: 'blog',
          name: 'fetchById'
        }]
      },
      {
        method: 'post',
        route: '/:blogId',
        handlers: [{
          base: 'blog',
          name: 'updateById'
        }]
      },
      {
        method: 'delete',
        route: '/:blogId',
        handlers: [{
          base: 'blog',
          name: 'deleteById'
        }]
      }
    ]
  }
}
