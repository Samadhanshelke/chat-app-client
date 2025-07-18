import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ToastContainer from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import { MessageProvider } from "./context/MessageContext";
import Test from './pages/Test'
function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
                  <MessageProvider>

                    <Home />
                  </MessageProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/test" element={<Test />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
