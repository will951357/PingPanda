import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import {Landing} from "./pages/landing/Landing"
import { MainLayout } from "./pages/dashboard/layouts/MainLayout"
import SignUpPage from "./pages/sign-up"
import SignInPage from "./pages/sign-in"
import Welcome from "./pages/welcome"
import DashboardPage from "./pages/dashboard/Dashbord"
import {CategoryEventPage} from "./pages/dashboard/CategoryEventPage"
import { UpgradePage } from "./pages/dashboard/Upgrade"
import { PricingPage} from "./pages/pricing"
import { AccountSettingsPage } from "./pages/dashboard/AccountSettingsPage"
import { ApiKeySettingsPage } from "./pages/dashboard/ApiKeySettingsPage"


import './App.css'

function App() {

  return (
      <Router>
        <main className="relative flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/category/:name" element={<CategoryEventPage />} />
              <Route path="/dashboard/upgrade" element={<UpgradePage />} />
              <Route path="/dashboard/accounting-settings" element={<AccountSettingsPage />} />
              <Route path="/dashboard/api-key" element={<ApiKeySettingsPage />} />

              {/* Adicione mais rotas aqui que usam o layout */}
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
            </Route>
          </Routes>
        </main>
      </Router>
  )
}

export default App
