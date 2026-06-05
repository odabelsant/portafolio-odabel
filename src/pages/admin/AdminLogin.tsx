import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate brief auth delay for UX
    await new Promise((r) => setTimeout(r, 600));

    if (!ADMIN_PASSWORD) {
      setError("Variable VITE_ADMIN_PASSWORD no está configurada en el entorno.");
      setIsLoading(false);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onSuccess();
    } else {
      setError("Contraseña incorrecta. Inténtalo de nuevo.");
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-20" />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl shadow-primary/10 p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 blur-md -z-10" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-white tracking-tight">
              Admin Backoffice
            </h1>
            <p className="text-sm text-slate-400 mt-1">Portafolio Odabel Santos</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-slate-300"
              >
                Contraseña de Acceso
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce la contraseña..."
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-slate-950/70 text-white border border-white/10 focus:border-primary focus:outline-none transition-all duration-300 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm font-medium"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !password}
              id="admin-login-btn"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Acceder al Panel</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-8">
            Acceso restringido — Solo administradores autorizados
          </p>
        </div>
      </motion.div>
    </div>
  );
};
