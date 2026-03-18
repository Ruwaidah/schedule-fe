import { BrowserRouter } from "react-router-dom"
import RoutesComponent from "./routes/RoutesComponent"
import AuthGate from "./components/AuthGate"


function App() {

  return (
    <BrowserRouter>
      <AuthGate>
        <RoutesComponent />
      </AuthGate>
    </BrowserRouter>
  )
}

export default App
