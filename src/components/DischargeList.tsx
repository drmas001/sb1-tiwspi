import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Patient } from '../types';
import { UserMinus, Calendar, Clock, Search } from 'lucide-react';

interface DischargeListProps {
  patients: Patient[];
  onRequestDischarge: (mrn: string) => void;
}

const DischargeList: React.FC<DischargeListProps> = ({ patients, onRequestDischarge }) => {
  const [searchMRN, setSearchMRN] = useState('');
  const [searchResult, setSearchResult] = useState<Patient | null>(null);

  const activePatients = patients.filter(patient => patient.status === 'Active');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const foundPatient = patients.find(patient => patient.mrn === searchMRN && patient.status === 'Active');
    setSearchResult(foundPatient || null);
  };

  const handleRequestDischarge = () => {
    if (searchResult) {
      onRequestDischarge(searchResult.mrn);
      setSearchMRN('');
      setSearchResult(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <UserMinus className="mr-2" />
        Discharge Patient
      </h2>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex items-center">
          <input
            type="text"
            value={searchMRN}
            onChange={(e) => setSearchMRN(e.target.value)}
            placeholder="Enter patient MRN"
            className="input flex-grow mr-2"
          />
          <button type="submit" className="btn btn-primary flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search
          </button>
        </div>
      </form>

      {searchResult && (
        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-2">{searchResult.name}</h3>
          <div className="text-sm text-gray-600 space-y-1 mb-4">
            <p>MRN: {searchResult.mrn}</p>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Admitted: {new Date(searchResult.admissionDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Days Admitted: {Math.floor((Date.now() - new Date(searchResult.admissionDate).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
          </div>
          <button onClick={handleRequestDischarge} className="btn btn-danger w-full">
            Request Discharge
          </button>
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-4">Active Patients</h3>
      {activePatients.length === 0 ? (
        <p className="text-gray-600">No active patients to discharge.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePatients.map(patient => (
            <div key={patient.id} className="card">
              <h3 className="text-xl font-semibold mb-2">{patient.name}</h3>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>MRN: {patient.mrn}</p>
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
                className="btn btn-danger w-full text-center"
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

export default DischargeList;