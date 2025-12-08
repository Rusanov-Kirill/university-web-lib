import React from 'react'
import HomePage from '../pages/HomePage/HomePage'
import BooksPage from '../pages/BooksPage/BooksPage'
import GenresPage from '../pages/GenresPage/GenresPage'
import AuthersPage from '../pages/AuthorsPage/AuthorsPage'
import AdminPanel from '../admin/pages/AdminPanel/AdminPanel'
import AdminLogin from '../admin/pages/AdminLogin/AdminLogin'
import AdminYandexComplete from '../admin/components/AdminYandexComplete/AdminYandexComplete'

const appRoutes = [
  { path: '/', element: React.createElement(HomePage), index: true },
  { path: '/books', element: React.createElement(BooksPage)},
  { path: '/genres', element: React.createElement(GenresPage)},
  { path: '/authors', element: React.createElement(AuthersPage)},
  { path: '/admin-login', element: React.createElement(AdminLogin)},
  { path: '/admin', element: React.createElement(AdminPanel)},
  { path: '/admin-yandex-complete', element: React.createElement(AdminYandexComplete)},
]

export default appRoutes
