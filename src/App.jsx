import { Route, Routes } from "react-router-dom";
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EditHouseContainer from './features/dashboard/edithouse/EditHouseContainer';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import AppLayout from "./ui/AppLayout";
import DashboardContainer from "./features/dashboard/DashboardContainer";

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardContainer />} />
          <Route path="/dashboard/edit-house/:uuid" element={<EditHouseContainer />} /> {/* Updated Route */}
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
