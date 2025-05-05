import appRoutes from './routes/AppRoutes'
import { useRoutes } from 'react-router-dom'

function App() {
  const routes = useRoutes(appRoutes);

  return (
    <>
      {routes}
    </>
  )
}

export default App
