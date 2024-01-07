import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/home'
import Profile from '../pages/profile'
import Surprise from '../pages/surprise'
import Wish from '../pages/wish'
import Root from 'root'
import NotFound from 'notfound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/surprise/:wanterAddr',
        element: <Surprise />
      },
      {
        path: '/wish',
        element: <Wish />
      }
    ]
  }
])

export default router
