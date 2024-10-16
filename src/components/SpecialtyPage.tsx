import React from 'react';
import { Patient, Specialty } from '../types';
import { Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SpecialtyPageProps {
  specialty: Specialty;
  patients: Patient[];
}

const SpecialtyPage: React.FC<SpecialtyPageProps> = ({ specialty, patients }) => {
  const activePatients = patients.filter(patient => patient.status === 'Active');

  return (
    <div className="card">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">{specialty}</h3>
      {activePatients.length === 0 ? (
        <p className="text-gray-600">No active patients in this specialty.</p>
      ) : (
        <div className="space-y-4">
          {activePatients.map(patient => (
            <div key={patient.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <Link to={`/patient/${patient.id}`} className="block hover:text-indigo-600 transition-colors duration-200">
                <h4 className="text-lg font-semibold mb-2">{patient.name}</h4>
              </Link>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Age: {patient.age}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Days Admitted: {Math.floor((Date.now() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
              </div>
              <Link
                to={`/discharge/${patient.id}`}
                className="btn btn-danger mt-3 text-sm"
              >
                Discharge
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialtyPage;