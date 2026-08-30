// import React, { useState } from 'react';
// import { Form, Button, Alert } from 'react-bootstrap';
// import { Link, Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function LoginForm() {
//   const { login, currentUser, isAdmin } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   if (currentUser) {
//     return <Navigate to={isAdmin ? '/disponibilites' : '/selectionpage'} />;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       await login(email, password);
//     } catch (err) {
//       setError("Email ou mot de passe incorrect.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-container" style={{ maxWidth: 420 }}>
//       <h2 className="mb-4 text-center">Connexion</h2>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="prenom.nom@icam.fr"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Mot de passe</Form.Label>
//           <Form.Control
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>
//         {error && <Alert variant="danger">{error}</Alert>}
//         <Button variant="primary" type="submit" className="w-100" disabled={loading}>
//           {loading ? 'Connexion…' : 'Se connecter'}
//         </Button>
//       </Form>
//       <p className="text-center mt-3">
//         Pas de compte ? <Link to="/register">Créer un compte</Link>
//       </p>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { login, currentUser, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return <Navigate to={isAdmin ? '/disponibilites' : '/selectionpage'} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --canvas: #0a0e1a;
          --panel: rgba(21, 27, 46, 0.86);
          --panel-solid: #151b2e;
          --panel-raised: #1b2338;
          --border-subtle: rgba(148, 163, 184, 0.14);
          --border-strong: rgba(148, 163, 184, 0.28);
          --text-primary: #f4f6fb;
          --text-muted: #93a0b8;
          --accent-violet: #7c6cf6;
          --accent-cyan: #29d3d3;
        }

        .login-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background:
            radial-gradient(900px 500px at 15% 10%, rgba(124,108,246,0.16), transparent 55%),
            radial-gradient(900px 500px at 85% 90%, rgba(41,211,211,0.12), transparent 55%),
            var(--canvas);
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: var(--panel);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
          border-radius: 18px;
          padding: 2.25rem 2rem;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        .login-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .login-brand .dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
          box-shadow: 0 0 10px var(--accent-cyan);
        }
        .login-brand span {
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--text-muted);
          font-size: 0.78rem;
          text-transform: uppercase;
        }
        .login-title {
          color: var(--text-primary);
          font-weight: 700;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .login-card .form-label {
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .login-card .form-control {
          background: var(--panel-raised);
          border: 1px solid var(--border-strong);
          color: var(--text-primary);
          border-radius: 10px;
          padding: 0.6rem 0.8rem;
        }
        .login-card .form-control:focus {
          background: var(--panel-raised);
          color: var(--text-primary);
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px rgba(41, 211, 211, 0.18);
        }
        .login-card .form-control::placeholder {
          color: rgba(148, 163, 184, 0.55);
        }
        .login-submit {
          background: linear-gradient(135deg, var(--accent-violet), #6355e0);
          border: none;
          border-radius: 10px;
          padding: 0.65rem;
          font-weight: 700;
        }
        .login-submit:hover, .login-submit:focus {
          background: linear-gradient(135deg, #8a7bff, #7264ee);
        }
        .login-footer-link {
          text-align: center;
          margin-top: 1.25rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .login-footer-link a {
          color: var(--accent-cyan);
          font-weight: 600;
          text-decoration: none;
        }
        .login-footer-link a:hover { text-decoration: underline; }
      `}</style>

      <div className="login-screen">
        <div className="login-card">
          <div className="login-brand">
            <span className="dot" />
            <span>Icam · Plateforme Projets</span>
          </div>
          <h2 className="login-title">Connexion</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="prenom.nom@icam.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {error && <Alert variant="danger" className="py-2">{error}</Alert>}
            <Button type="submit" className="w-100 login-submit" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </Form>

          <p className="login-footer-link">
            Pas de compte ? <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </div>
    </>
  );
}