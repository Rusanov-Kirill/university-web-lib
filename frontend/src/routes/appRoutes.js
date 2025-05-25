import React from 'react'
import HomePage from '../pages/HomePage/HomePage'
import BooksPage from '../pages/BooksPage/BooksPage'
import GenresPage from '../pages/GenresPage/GenresPage'
import AuthersPage from '../pages/AuthorsPage/AuthorsPage'

const appRoutes = [
  { path: '/', element: React.createElement(HomePage), index: true },
  { path: '/books', element: React.createElement(BooksPage)},
  { path: '/genres', element: React.createElement(GenresPage)},
  { path: '/authors', element: React.createElement(AuthersPage)}
]

export default appRoutes
