import React, { useState } from 'react';
import { Patient, MedicalNote } from '../types';
import { Calendar, Clock, User, FileText, PlusCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface PatientDetailsProps {
  patients: Patient[];
  medicalNotes: MedicalNote[];
  onAddNote: (note: MedicalNote) => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patients, medicalNotes, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const { id } = useParams<{ id: string }>();

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const patientNotes = medicalNotes.filter(note => note.patientId === patient.id);

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote({
        id: Date.now().toString(),
        patientId: patient.id,
        date: new Date().toISOString(),
        note: newNote,
        user: 'Current User', // Replace with actual user when authentication is implemented
      });
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">{patient.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span>Age: {patient.age}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Admitted: {new Date(patient.admissionDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>Days Admitted: {Math.floor((Date.now() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
          </div>
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            <span>Specialty: {patient.specialty}</span>
          </div>
        </div>
        <Link
          to={`/discharge/${patient.id}`}
          className="btn btn-danger mt-6"
        >
          Discharge Patient
        </Link>
      </div>
      
      <div className="card">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Medical Notes</h3>
        <div className="space-y-4 mb-6">
          {patientNotes.map(note => (
            <div key={note.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">{new Date(note.date).toLocaleString()}</span>
                <span className="text-gray-600 text-sm">{note.user}</span>
              </div>
              <p className="text-gray-700">{note.note}</p>
            </div>
          ))}
        </div>
        
        <div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="input"
            rows={4}
            placeholder="Add a new medical note..."
          ></textarea>
          <button
            onClick={handleAddNote}
            className="btn btn-primary mt-2 flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;