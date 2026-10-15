import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HeaderDis from "../../components/layout/HeaderDis";

type TipoRecaudo = "DIGITAL" | "EFECTIVO" | "MICROCREDITO";
type FiltroPago = "TODOS" | TipoRecaudo;

interface RegistroConciliacion {
  id: number;
  recaudo: number;
  codigo: string;
  fecha: string;
  hora: string;
  clienteId: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  comercio: string;
  departamento: string;
  ciudad: string;
  empresa: string;
  codigoProducto: string;
  cantidad: number;
  placa: string;
  transportista: string;
  ruta: string;
  tipoRecaudo: TipoRecaudo;
}

const datosDemo: RegistroConciliacion[] = [
  {
    id: 1,
    recaudo: 150000,
    codigo: "FAC-1001",
    fecha: "30/09/2026",
    hora: "08:15:00",
    clienteId: "8100007756",
    cedula: "1001001001",
    nombres: "Carlos",
    apellidos: "Gómez Pérez",
    comercio: "Tienda La Esperanza",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-001",
    cantidad: 1,
    placa: "ABC123",
    transportista: "3001234567",
    ruta: "Ruta Norte",
    tipoRecaudo: "DIGITAL",
  },
  {
    id: 2,
    recaudo: 85000,
    codigo: "FAC-1002",
    fecha: "30/09/2026",
    hora: "09:20:00",
    clienteId: "8100163222",
    cedula: "1001001002",
    nombres: "María",
    apellidos: "Rodríguez López",
    comercio: "Supermercado El Sol",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-001",
    cantidad: 1,
    placa: "ABC123",
    transportista: "3001234567",
    ruta: "Ruta Norte",
    tipoRecaudo: "EFECTIVO",
  },
  {
    id: 3,
    recaudo: 220000,
    codigo: "FAC-1003",
    fecha: "30/09/2026",
    hora: "10:30:00",
    clienteId: "8100004211",
    cedula: "1001001003",
    nombres: "Juan",
    apellidos: "Martínez",
    comercio: "Tienda San José",
    departamento: "Valle del Cauca",
    ciudad: "Palmira",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-002",
    cantidad: 1,
    placa: "XYZ789",
    transportista: "3109876543",
    ruta: "Ruta Sur",
    tipoRecaudo: "DIGITAL",
  },
  {
    id: 4,
    recaudo: 120000,
    codigo: "FAC-1004",
    fecha: "29/09/2026",
    hora: "11:00:00",
    clienteId: "8100009825",
    cedula: "1001001004",
    nombres: "Ana",
    apellidos: "Torres Ramírez",
    comercio: "Mini Mercado Centro",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-003",
    cantidad: 1,
    placa: "DEF456",
    transportista: "3155555555",
    ruta: "Ruta Centro",
    tipoRecaudo: "EFECTIVO",
  },
  {
    id: 5,
    recaudo: 95000,
    codigo: "FAC-1005",
    fecha: "29/09/2026",
    hora: "12:15:00",
    clienteId: "8100009826",
    cedula: "1001001005",
    nombres: "Pedro",
    apellidos: "Ramírez",
    comercio: "Tienda El Progreso",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    empresa: "SURTIALIMENTOS",
    codigoProducto: "PL-004",
    cantidad: 1,
    placa: "DEF456",
    transportista: "3155555555",
    ruta: "Ruta Centro",
    tipoRecaudo: "MICROCREDITO",
  },
];

interface ResumenDiario {
  fecha: string;
  recaudo: number;
  registros: RegistroConciliacion[];
}

const formatearMiles = (numero: number) =>
  new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(Number(numero || 0));

const formatearFecha = (fecha: string) => {
  if (!fecha) return "";
  const [dia, mes, ano] = fecha.split("/");
  return `${ano}-${mes}-${dia}`;
};

function ConciliacionMensual() {
  const navigate = useNavigate();

  const [mesAnoSeleccionado, setMesAnoSeleccionado] = useState("");
  const [distribuidorSeleccionado, setDistribuidorSeleccionado] =
    useState("");
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] =
    useState<FiltroPago>("TODOS");

  const filas = useMemo<ResumenDiario[]>(() => {
    if (!mesAnoSeleccionado || !distribuidorSeleccionado) {
      return [];
    }

    const registrosFiltrados = datosDemo.filter((fila) => {
      const [, mes, ano] = fila.fecha.split("/");

      const coincideMes = `${ano}-${mes}` === mesAnoSeleccionado;
      const coincideDistribuidor =
        fila.empresa === distribuidorSeleccionado;
      const coincidePago =
        tipoPagoSeleccionado === "TODOS" ||
        fila.tipoRecaudo === tipoPagoSeleccionado;

      return coincideMes && coincideDistribuidor && coincidePago;
    });

    const agrupados = registrosFiltrados.reduce<
      Record<string, ResumenDiario>
    >((acumulado, fila) => {
      if (!acumulado[fila.fecha]) {
        acumulado[fila.fecha] = {
          fecha: fila.fecha,
          recaudo: 0,
          registros: [],
        };
      }

      acumulado[fila.fecha].recaudo += fila.recaudo;
      acumulado[fila.fecha].registros.push(fila);

      return acumulado;
    }, {});

    return Object.values(agrupados).sort((a, b) =>
      formatearFecha(b.fecha).localeCompare(formatearFecha(a.fecha))
    );
  }, [
    mesAnoSeleccionado,
    distribuidorSeleccionado,
    tipoPagoSeleccionado,
  ]);

  const totalFiltrado = useMemo(
    () => filas.reduce((total, fila) => total + fila.recaudo, 0),
    [filas]
  );

  const verDetalle = (fila: ResumenDiario) => {
    const primerRegistro = fila.registros[0];

    localStorage.setItem(
      "detalle-conciliacion-mensual",
      JSON.stringify({
        fecha: fila.fecha,
        recaudo: fila.recaudo,
        distribuidor: distribuidorSeleccionado,
        tipoPago: tipoPagoSeleccionado,
        codigo: primerRegistro?.codigo || "N/A",
        hora: primerRegistro?.hora || "N/A",
        clienteId: primerRegistro?.clienteId || "N/A",
        cedula: primerRegistro?.cedula || "N/A",
        nombres: primerRegistro?.nombres || "N/A",
        apellidos: primerRegistro?.apellidos || "",
        comercio: primerRegistro?.comercio || "N/A",
        departamento: primerRegistro?.departamento || "N/A",
        ciudad: primerRegistro?.ciudad || "N/A",
        empresa: primerRegistro?.empresa || "N/A",
        codigoProducto: primerRegistro?.codigoProducto || "N/A",
        cantidad: primerRegistro?.cantidad || 0,
        placa: primerRegistro?.placa || "N/A",
        transportista: primerRegistro?.transportista || "N/A",
        ruta: primerRegistro?.ruta || "N/A",
        registros: fila.registros,
      })
    );

    navigate("/detalle-conciliacion-mensual");
  };

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", bgcolor: "#fff" }}>
      <HeaderDis />

      <Box
        component="main"
        sx={{ width: "100%", px: { xs: 1.5, sm: 2, md: 2.5 }, py: 3, boxSizing: "border-box" }}
      >
        <Typography
          component="h1"
          sx={{ fontSize: 24, fontWeight: 800, color: "#000", mb: 3 }}
        >
          Conciliación Mensual
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            mb: 3,
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Mes y Año"
            type="month"
            value={mesAnoSeleccionado}
            onChange={(event) => setMesAnoSeleccionado(event.target.value)}
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: { xs: "100%", sm: 200 } }}
          />

          <TextField
            select
            label="Distribuidor"
            value={distribuidorSeleccionado}
            onChange={(event) => setDistribuidorSeleccionado(event.target.value)}
            size="small"
            sx={{ width: { xs: "100%", sm: 220 } }}
          >
            <MenuItem value="SURTIALIMENTOS">SURTIALIMENTOS</MenuItem>
            <MenuItem value="SUPER80">SUPER80</MenuItem>
          </TextField>

          <TextField
            select
            label="Tipo de pago"
            value={tipoPagoSeleccionado}
            onChange={(event) =>
              setTipoPagoSeleccionado(event.target.value as FiltroPago)
            }
            size="small"
            sx={{ width: { xs: "100%", sm: 230 } }}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="DIGITAL">Pagos digitales</MenuItem>
            <MenuItem value="EFECTIVO">Pagos en efectivo</MenuItem>
            <MenuItem value="MICROCREDITO">Pagos microcrédito</MenuItem>
          </TextField>
        </Box>

        {!mesAnoSeleccionado && (
          <Paper
            elevation={0}
            sx={{
              minHeight: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              border: "1px solid #f1f5f9",
              borderRadius: 2,
            }}
          >
            <CalendarMonthOutlinedIcon sx={{ color: "#9ca3af" }} />
            <Typography sx={{ color: "#9ca3af", fontSize: 14 }}>
              Seleccione un mes y un año
            </Typography>
          </Paper>
        )}

        {mesAnoSeleccionado && !distribuidorSeleccionado && (
          <Paper
            elevation={0}
            sx={{
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #f1f5f9",
              borderRadius: 2,
            }}
          >
            <Typography sx={{ color: "#9ca3af", fontSize: 14 }}>
              Seleccione un distribuidor.
            </Typography>
          </Paper>
        )}

        {mesAnoSeleccionado && distribuidorSeleccionado && filas.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #f1f5f9",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography sx={{ color: "#9ca3af", fontSize: 14, textAlign: "center" }}>
              No hay datos para el mes, distribuidor y tipo de pago seleccionados.
            </Typography>
          </Paper>
        )}

        {mesAnoSeleccionado && distribuidorSeleccionado && filas.length > 0 && (
          <>
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                p: 2,
                mb: 2,
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                  Total recaudado
                </Typography>
                <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>
                  $ {formatearMiles(totalFiltrado)}
                </Typography>
              </Box>

              <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                {tipoPagoSeleccionado === "TODOS"
                  ? "Todos los pagos"
                  : tipoPagoSeleccionado === "DIGITAL"
                    ? "Pagos digitales"
                    : tipoPagoSeleccionado === "EFECTIVO"
                      ? "Pagos en efectivo"
                      : "Pagos microcrédito"}
              </Typography>
            </Paper>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ width: "100%", borderRadius: 2, overflowX: "auto", border: "1px solid #f1f5f9" }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {["Fecha", "Recaudo", "Acciones"].map((titulo) => (
                      <TableCell
                        key={titulo}
                        sx={{
                          backgroundColor: "#f8fafc",
                          color: "#374151",
                          fontSize: 13,
                          fontWeight: 700,
                          py: 1.5,
                          whiteSpace: "nowrap",
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        {titulo}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filas.map((fila) => (
                    <TableRow key={fila.fecha} hover>
                      <TableCell sx={{ py: 1.5, whiteSpace: "nowrap" }}>
                        <TextField
                          type="date"
                          value={formatearFecha(fila.fecha)}
                          disabled
                          size="small"
                          sx={{ width: 170 }}
                        />
                      </TableCell>

                      <TableCell sx={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap" }}>
                        $ {formatearMiles(fila.recaudo)}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="text"
                          onClick={() => verDetalle(fila)}
                          sx={{
                            minWidth: "auto",
                            p: 0,
                            color: "#00a8e8",
                            fontSize: 13.5,
                            textTransform: "none",
                          }}
                        >
                          Ver detalle ({fila.registros.length})
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Box>
  );
}

export default ConciliacionMensual;