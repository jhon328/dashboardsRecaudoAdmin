import { useNavigate } from "react-router-dom";
import "./HeaderDis.css";

function HeaderDis() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/recaudo");
  };

  return (
    <header className="header-bar">
      <div className="brand">
        <img
          src="/enlaceFiado.png"
          alt="Enlace CRM"
          className="logo enlace"
          onClick={goToLogin}
        />

        <span className="divider">|</span>

        <img
          src="/bancoW.png"
          alt="Banco W"
          className="logo banco"
        />
      </div>

      <div
        className="user-profile"
        title="Cerrar sesión"
      >
        <span className="user-name">
          Surtialimentos
        </span>
      </div>
    </header>
  );
}

export default HeaderDis;