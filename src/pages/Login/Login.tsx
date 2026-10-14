import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

   const iniciarSesion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const usuariosDemo = [
        {
            usuario: "admin",
            password: "123456",
            rol: "admin",
        },
        {
            usuario: "tesoreria",
            password: "123456",
            rol: "tesoreria",
        },
    ];

    const usuarioEncontrado = usuariosDemo.find(
        (item) =>
            item.usuario === usuario &&
            item.password === password
    );

    if (!usuarioEncontrado) {
        setError("Usuario o contraseña incorrectos.");
        return;
    }

    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem(
        "admin_user",
        usuarioEncontrado.usuario
    );
    sessionStorage.setItem(
        "rol",
        usuarioEncontrado.rol
    );

    if (usuarioEncontrado.rol === "tesoreria") {
        navigate("/conciliacion-mensual");
        return;
    }

    navigate("/recaudo");
};


    return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <img
            src="/enlaceFiado.png"
            alt="Enlace CRM"
          />
        </div>

        <h1>Iniciar sesión</h1>

        <p className="login-subtitle">
          Ingresa tus credenciales para continuar
        </p>

        <form onSubmit={iniciarSesion}>

          <div className="form-group">
            <label htmlFor="usuario">
              Usuario
            </label>

            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(event) =>
                setUsuario(event.target.value)
              }
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Iniciar sesión
          </button>

        </form>

        <div className="demo-credentials">
          <span>Usuario demo:</span>
          <strong>admin</strong>

          <span>Contraseña:</span>
          <strong>123456</strong>
        </div>

      </div>
    </div>
  );
}

export default Login;