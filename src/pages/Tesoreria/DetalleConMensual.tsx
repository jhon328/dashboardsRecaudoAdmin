import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  InputAdornment,
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
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HeaderDis from "../../components/layout/HeaderDis";

type TipoRecaudo = "DIGITAL" | "EFECTIVO" | "MICROCREDITO";

interface RegistroDetalle {
  id?: number;
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
  ruta?: string;
  tipoRecaudo: TipoRecaudo;
}

interface DatosDetalle {
  fecha: string;
  recaudo: number;
  codigo: string;
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
  distribuidor: string;
  tipoPago: string;
  registros: RegistroDetalle[];
}

const datosIniciales: DatosDetalle = {
  fecha: "",
  recaudo: 0,
  codigo: "N/A",
  hora: "N/A",
  clienteId: "N/A",
  cedula: "N/A",
  nombres: "N/A",
  apellidos: "",
  comercio: "N/A",
  departamento: "N/A",
  ciudad: "N/A",
  empresa: "N/A",
  codigoProducto: "N/A",
  cantidad: 0,
  placa: "N/A",
  transportista: "N/A",
  distribuidor: "",
  tipoPago: "TODOS",
  registros: [],
};

const formatoMiles = (numero: number) =>
  new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(Number(numero || 0));

const formatearFecha = (fecha: string) => {
  if (!fecha) return "N/A";

  const partes = fecha.split("/");

  if (partes.length !== 3) return fecha;

  const [dia, mes, ano] = partes;
  const date = new Date(Number(ano), Number(mes) - 1, Number(dia));

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const nombreTipoPago = (tipo: string) => {
  switch (tipo) {
    case "DIGITAL":
      return "Digital";
    case "EFECTIVO":
      return "Efectivo";
    case "MICROCREDITO":
      return "Microcrédito";
    default:
      return "Todos";
  }
};

function DetalleConMensual() {
  const navigate = useNavigate();
  const [busquedaFiltro, setBusquedaFiltro] = useState("");

  const [datosDetalle] = useState<DatosDetalle>(() => {
    try {
      const guardados = localStorage.getItem(
        "detalle-conciliacion-mensual"
      );

      if (!guardados) return datosIniciales;

      const datos = JSON.parse(guardados);

      return {
        ...datosIniciales,
        ...datos,
        recaudo: Number(datos.recaudo || 0),
        registros: Array.isArray(datos.registros)
          ? datos.registros
          : [],
      };
    } catch {
      return datosIniciales;
    }
  });

  const registrosFiltrados = useMemo(() => {
    const q = busquedaFiltro.toLowerCase().trim();

    if (!q) return datosDetalle.registros;

    return datosDetalle.registros.filter((registro) =>
      [
        registro.codigo,
        registro.clienteId,
        registro.cedula,
        registro.nombres,
        registro.apellidos,
        registro.comercio,
        registro.departamento,
        registro.ciudad,
        registro.empresa,
        registro.codigoProducto,
        registro.placa,
        registro.transportista,
        registro.tipoRecaudo,
      ].some((valor) =>
        String(valor ?? "").toLowerCase().includes(q)
      )
    );
  }, [busquedaFiltro, datosDetalle.registros]);

  const totalRegistros = useMemo(
    () =>
      datosDetalle.registros.reduce(
        (total, registro) => total + Number(registro.recaudo || 0),
        0
      ),
    [datosDetalle.registros]
  );

  const regresar = () => navigate(-1);

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", bgcolor: "#fff" }}>
      <HeaderDis />

      <Box
        component="main"
        sx={{
          width: "100%",
          px: { xs: 1.5, sm: 2, md: 2.5 },
          py: 3,
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={regresar}
            sx={{
              textTransform: "none",
              color: "#3338a0",
              fontWeight: 600,
              px: 0,
            }}
          >
            Regresar
          </Button>

          <Typography
            component="h1"
            sx={{ fontSize: { xs: 22, sm: 24 }, fontWeight: 800, color: "#000" }}
          >
            Detalle de Conciliación Mensual
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            mb: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
            }}
          >
            {[
              ["Fecha", formatearFecha(datosDetalle.fecha)],
              ["Distribuidor", datosDetalle.distribuidor || datosDetalle.empresa],
              ["Tipo de pago", nombreTipoPago(datosDetalle.tipoPago)],
              ["Cantidad de pagos", String(datosDetalle.registros.length)],
            ].map(([titulo, valor]) => (
              <Box key={titulo} sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 0.5 }}>
                  {titulo}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>
                  {valor}
                </Typography>
              </Box>
            ))}

            <Box sx={{ p: 2.5, gridColumn: { md: "span 4" }, borderTop: "1px solid #f1f5f9" }}>
              <Typography
                sx={{
                  fontSize: { xs: 24, sm: 28 },
                  fontWeight: 800,
                  color: "#000",
                  lineHeight: 1.2,
                }}
              >
                $ {formatoMiles(totalRegistros)}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.5 }}>
                Total de los pagos incluidos en este detalle
              </Typography>
            </Box>
          </Box>
        </Paper>

        <TextField
          fullWidth
          value={busquedaFiltro}
          onChange={(event) => setBusquedaFiltro(event.target.value)}
          placeholder="Buscar factura, cliente, documento, tienda, tipo de pago o placa"
          size="small"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#6b7280", fontSize: 21 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 3 }}
        />

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ width: "100%", borderRadius: 2, overflowX: "auto", border: "1px solid #f1f5f9" }}
        >
          <Table sx={{ minWidth: 1550 }}>
            <TableHead>
              <TableRow>
                {[
                  "Factura",
                  "Valor",
                  "Tipo de pago",
                  "Fecha Pago",
                  "Hora Pago",
                  "Cliente ID",
                  "Documento",
                  "Nombre y Apellido",
                  "Tienda",
                  "Departamento / Ciudad",
                  "Distribuidor",
                  "Planilla",
                  "Placa",
                  "Teléfono transportista",
                ].map((titulo) => (
                  <TableCell
                    key={titulo}
                    sx={{
                      backgroundColor: "#f8fafc",
                      color: "#374151",
                      fontSize: 13,
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {titulo}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {registrosFiltrados.map((registro, index) => (
                <TableRow key={registro.id ?? `${registro.codigo}-${index}`} hover>
                  <TableCell sx={{ color: "#3338a0", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {registro.codigo}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                    $ {formatoMiles(registro.recaudo)}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {nombreTipoPago(registro.tipoRecaudo)}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.fecha}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.hora}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.clienteId}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.cedula}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {[registro.nombres, registro.apellidos].filter(Boolean).join(" ")}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.comercio}
                  </TableCell>

                  <TableCell sx={{ minWidth: 160 }}>
                    <Box>{registro.departamento}</Box>
                    <Box>{registro.ciudad}</Box>
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.empresa}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.codigoProducto}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.placa}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {registro.transportista}
                  </TableCell>
                </TableRow>
              ))}

              {registrosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={14}
                    align="center"
                    sx={{ padding: "30px", color: "#9ca3af" }}
                  >
                    No hay registros para la búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default DetalleConMensual;