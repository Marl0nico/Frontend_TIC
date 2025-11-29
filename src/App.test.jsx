import { render, screen } from "@testing-library/react";
import { describe, it, afterEach, vi,expect } from "vitest";
import App from "./App";
import { useAuthStore } from "@/Chat/store/useAuthStore";

// Mock del store para evitar efectos secundarios
vi.mock("./Chat/store/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    checkAuth: vi.fn(),
    // Puedes ajustar isAuthenticated según lo necesites para cada test
    isAuthenticated: false,
  })),
}));

describe("App", () => {
  // Restablecer la URL después de cada prueba
  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renderiza landing page por default", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    // Ajusta el texto que esperas en tu landing page
    expect(screen.getByText(/Listo para conectar/i)).toBeInTheDocument();
  });

  it("renderiza el login page al navegar a la ruta /login", () => {
    window.history.pushState({}, "", "/login");
    render(<App />);
    // Ajusta el texto que esperas en la página de login
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("renderiza pagina de registro al navegar a la ruta /register", () => {
    window.history.pushState({}, "", "/register");
    render(<App />);
    // Ajusta el texto esperado en la página de registro
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
  });

  it("muestra pagina 404 al acceder a una ruta inexistente", () => {
    window.history.pushState({}, "", "/ruta-no-existe");
    render(<App />);
    // Ajusta el texto esperado para la página 404
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it("redirecciona al login si se trata de acceder a una ruta protegida", () => {
    window.history.pushState({}, "", "/dashboard");
    render(<App />);
    // Ajusta el texto esperado (por ejemplo, el de login) cuando no se encuentra autenticado
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});

