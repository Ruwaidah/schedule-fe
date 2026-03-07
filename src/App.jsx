import LoginPage from "./pages/LoginPage"
import { BrowserRouter } from "react-router-dom"
import RoutesComponent from "./routes/RoutesComponent"


function App() {

  return (
    <BrowserRouter>
      <RoutesComponent />
    </BrowserRouter>
  )
}

export default App
