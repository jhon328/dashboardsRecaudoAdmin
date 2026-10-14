import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import RecaudoDiario from "../pages/Recaudo/RecaudoDiario";
import DetalleRecaudo from "../pages/Recaudo/DetalleRecaudo";
import ConciliacionMensual from "../pages/Tesoreria/ConciliacionMensual";
import DetalleConMensual from "../pages/Tesoreria/DetalleConMensual";

function RutaProtegida({ children }: { children: React.ReactNode }) {
  const autenticado = sessionStorage.getItem("isAuthenticated");

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/recaudo"
        element={
          <RutaProtegida>
            <RecaudoDiario />
          </RutaProtegida>
            }
      />
      
      <Route
        path="/recaudo/detalle"
        element={
          <RutaProtegida>
            <DetalleRecaudo />
            </RutaProtegida>
        }
      />

      <Route
        path="/conciliacion-mensual"
        element={
          <RutaProtegida>
            <ConciliacionMensual />
            </RutaProtegida>
        }
      />
      <Route
        path="/detalle-conciliacion-mensual"
        element={
          <RutaProtegida>
            <DetalleConMensual />
          </RutaProtegida>
        }
      />
      
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRouter;