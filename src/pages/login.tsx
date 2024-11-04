// Importamos las dependencias necesarias
import { useState } from 'react'; // Para manejar el estado
import { useAuth } from '@/contexts/auth-context'; // Hook personalizado para autenticación
import { Button } from '@/components/ui/button'; // Componente de botón
import { Input } from '@/components/ui/input'; // Componente de input
import { toast } from 'sonner'; // Para mostrar notificaciones
import { Sprout } from 'lucide-react'; // Icono de planta

export function LoginPage() {
  // Obtenemos la función signIn del contexto de autenticación
  const { signIn } = useAuth();
  
  // Estados para manejar el email, password y estado de carga
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto
    setLoading(true); // Activamos el estado de carga

    try {
      // Intentamos iniciar sesión
      await signIn(email, password);
      toast.success('Welcome back!'); // Mostramos mensaje de éxito
    } catch (error) {
      // Manejamos los errores y mostramos mensaje apropiado
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Ha ocurrido un error durante el inicio de sesión';
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[90%] rounded-xl border bg-card p-4 shadow-lg sm:max-w-[400px] sm:p-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-muted p-3">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold sm:text-2xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form className="mt-6 space-y-4 sm:mt-8" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-sm font-medium">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 sm:mt-2"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 sm:mt-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground sm:text-sm">
          Demo credentials: admin@example.com / password
        </p>
      </div>
    </div>
  );
}