import "./LoginScreen.css";

import { useState } from "react";
import axios from "axios";

import LoginForm from "../../components/forms/LoginForm/LoginForm";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function LoginScreen() {

  const cancelarForm = () => {
    console.log("Limpio");
    setUser("");
    setPassword("");
    setMensaje("");
  };

  const guardarForm = async () => {
    try {
      const errores = [];

      if (!user || user.trim().length < 1) {
        errores.push("El usuario es un campo obligatorio.");
      }
      if (!password || password.length < 1) {
        errores.push("La clave es un campo obligatorio.");
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMensaje(mensajeError);
        return;
      }

      const response = await axios({
        url: base_url + "/api/login",
        method: "POST",
        data: {
          user: user.trim(),
          password: password,
        },
        validateStatus: () => true,
      });

      if (response.status == 200 && response.data.status) {
        cancelarForm();
        localStorage.setItem('token', response.data.data.token);
        window.location.reload();
        setMensaje("Bienvenido");
      } else {
        setMensaje(
          `No se pudo iniciar sesión, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al iniciar sesión: " + error.message);
    }
  };

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  return (
    <div className="LoginScreen">
      <div className="TitleContainer">
        <h1>Inicio de sesión</h1>
      </div>
      <LoginForm
        cancelarFn={cancelarForm}
        guardarFn={guardarForm}
        setUser={setUser}
        setPassword={setPassword}
        user={user}
        password={password}
        mensaje={mensaje}
      />
    </div>
  );
}
