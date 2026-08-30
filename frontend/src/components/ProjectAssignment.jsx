import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Navbar from './Navbar';
import {
  fetchEtudiants,
  fetchChefsDeProjet,
  fetchAffectations,
  saveAffectation,
} from '../services/supabase';

export default function ProjectAssignment() {
  const [etudiants, setEtudiants] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [etuds, chefsData, affs] = await Promise.all([
        fetchEtudiants(),
        fetchChefsDeProjet(),
        fetchAffectations(),
      ]);
      setEtudiants(etuds);
      setChefs(chefsData);
      setAffectations(affs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const affectationFor = (etudId) => affectations.find((a) => a.etudiant_id === etudId);

  const handleAssign = async (etudiantId, chefId) => {
    if (!chefId) return;
    setSaving(etudiantId);
    setError(null);
    try {
      await saveAffectation(Number(chefId), etudiantId);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2>Affectation finale des étudiants</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Email</th>
              <th>Chef de projet affecté</th>
            </tr>
          </thead>
          <tbody>
            {etudiants.map((etud) => {
              const current = affectationFor(etud.id);
              return (
                <tr key={etud.id}>
                  <td>
                    {etud.nom} {etud.prenom}
                  </td>
                  <td>{etud.adresse_email}</td>
                  <td>
                    <Form.Select
                      value={current?.chef_de_projet_id || ''}
                      disabled={saving === etud.id}
                      onChange={(e) => handleAssign(etud.id, e.target.value)}
                    >
                      <option value="">— Non affecté —</option>
                      {chefs.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nom}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}
