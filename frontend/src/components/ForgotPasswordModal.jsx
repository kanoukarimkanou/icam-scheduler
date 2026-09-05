import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordModal({ show, onHide }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setFeedback(null);

    try {
      await resetPassword(email);
      setFeedback({
        type: 'success',
        message: 'Si un compte est associe a cette adresse, un courriel contenant un lien de reinitialisation vient d etre envoye. Veuillez verifier votre boite de reception (y compris les courriers indesirables).',
      });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.message || 'Une erreur est survenue lors de l envoi.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setFeedback(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="modal-dark">
      <Modal.Header closeButton closeVariant="white" style={{ background: '#172338', borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
        <Modal.Title style={{ fontSize: '1.15rem', color: '#f4f6fb', fontWeight: 700 }}>
          Reinitialisation du mot de passe
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ background: '#111a2c', color: '#f4f6fb', padding: '1.5rem' }}>
          {feedback && <Alert variant={feedback.type} className="py-2 small">{feedback.message}</Alert>}

          <p className="text-muted small mb-3">
            Saisissez l adresse email associee a votre compte Icam. Vous recevrez un lien securise pour definir un nouveau mot de passe.
          </p>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-muted">Adresse email</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="prenom.nom@icam.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ background: '#172338', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <Button variant="secondary" size="sm" onClick={handleClose} disabled={loading}>
            Fermer
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={loading || !email}
            style={{ background: 'linear-gradient(135deg, #7c6cf6, #6355e0)', border: 'none', fontWeight: 600 }}
          >
            {loading ? <Spinner size="sm" animation="border" /> : 'Envoyer le lien'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}