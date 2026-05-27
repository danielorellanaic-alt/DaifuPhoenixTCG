import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Correo o contraseña incorrectos");
      console.log(error);
      return;
    }

    if (data.user) {
      onLogin(data.user);
    }
  };

  return (
    <main className="admin-login">
      <form onSubmit={handleSubmit} className="admin-card">
        <h1>Panel Admin</h1>

        <p>Acceso privado de la tienda</p>

        <input
          type="email"
          placeholder="Correo administrador"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}