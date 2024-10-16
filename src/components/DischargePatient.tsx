import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types';
import { UserMinus } from 'lucide-react';

interface DischargePatientProps {
  patient: Patient;
  onDischarge: (patientId: string, dischargeNotes: string) => void;
}

const DischargePatient: React.FC<DischargePatientProps> = ({ patient, onDischarge }) => {
  const [dischargeNotes, setDischargeNotes] = useState('');
  const navigate = useNavigate();

  const handleDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    onDischarge(patient.id, dischargeNotes);
    navigate('/specialties');
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <UserMinus className="mr-2" />
        Discharge Patient
      </h2>
      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-2">Patient Information</h3>
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>MRN:</strong> {patient.mrn}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
        <p><strong>Admission Date:</strong> {new Date(patient.admissionDate).toLocaleDateString()}</p>
      </div>
      <form onSubmit={handleDischarge} className="card space-y-4">
        <div>
          <label htmlFor="dischargeNotes" className="block text-sm font-medium text-gray-700">Discharge Notes</label>
          <textarea
            id="dischargeNotes"
            value={dischargeNotes}
            onChange={(e) => setDischargeNotes(e.target.value)}
            required
            className="input"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Discharge Patient
        </button>
      </form>
    </div>
  );
};

export default DischargePatient;