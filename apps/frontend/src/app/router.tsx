import { createBrowserRouter } from 'react-router'
import { Layout } from '../components/layout/Layout'
import { EjercicioPage } from '../pages/ejercicios/EjercicioPage'
import { EjerciciosPage } from '../pages/ejercicios/EjerciciosPage'
import { HomePage } from '../pages/home/HomePage'
import { NosotrosPage } from '../pages/nosotros/NosotrosPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/nosotros', element: <NosotrosPage /> },
      { path: '/ejercicios', element: <EjerciciosPage /> },
      { path: '/ejercicios/:slug', element: <EjercicioPage /> },
    ],
  },
])
