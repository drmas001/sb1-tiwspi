import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import AdmitPatient from './components/AdmitPatient';
import SpecialtyPage from './components/SpecialtyPage';
import PatientDetails from './components/PatientDetails';
import DischargePatient from './components/DischargePatient';
import DischargeList from './components/DischargeList';
import DailyReportComponent from './components/DailyReport';
import { Patient, MedicalNote, Specialty, DailyReport } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalNotes, setMedicalNotes] = useState<MedicalNote[]>([]);

  const handleAdmitPatient = (newPatient: Patient) => {
    setPatients(prevPatients => [...prevPatients, newPatient]);
  };

  const handleAddNote = (newNote: MedicalNote) => {
    setMedicalNotes(prevNotes => [...prevNotes, newNote]);
  };

  const handleDischargePatient = (patientId: string, dischargeNotes: string) => {
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === patientId
          ? { ...patient, status: 'Discharged', dischargeDate: new Date().toISOString() }
          : patient
      )
    );
    handleAddNote({
      id: uuidv4(),
      patientId,
      date: new Date().toISOString(),
      note: `Discharge notes: ${dischargeNotes}`,
      user: 'System',
    });
  };

  const handleRequestDischarge = (mrn: string) => {
    const patient = patients.find(p => p.mrn === mrn && p.status === 'Active');
    if (patient) {
      handleDischargePatient(patient.id, 'Discharge requested');
    }
  };

  const generateDailyReport = (): DailyReport => {
    const specialties: Specialty[] = [
      'General Internal Medicine',
      'Hematology',
      'Rheumatology',
      'Pulmonology',
      'Infectious Diseases',
      'Neurology',
      'Endocrinology',
    ];

    const report: DailyReport = {
      date: new Date().toISOString(),
      specialties: {} as DailyReport['specialties'],
    };

    specialties.forEach(specialty => {
      report.specialties[specialty] = {
        activePatients: patients.filter(
          p => p.specialty === specialty && p.status === 'Active'
        ),
        dischargedPatients: patients.filter(
          p => p.specialty === specialty && p.status === 'Discharged'
        ),
      };
    });

    return report;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-16">
          <Navigation />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admit" element={<AdmitPatient onAdmit={handleAdmitPatient} />} />
              <Route path="/specialties" element={
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">Specialties</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['General Internal Medicine', 'Hematology', 'Rheumatology', 'Pulmonology', 'Infectious Diseases', 'Neurology', 'Endocrinology'].map(specialty => (
                      <SpecialtyPage
                        key={specialty}
                        specialty={specialty as Specialty}
                        patients={patients.filter(p => p.specialty === specialty && p.status === 'Active')}
                      />
                    ))}
                  </div>
                </div>
              } />
              <Route path="/patient/:id" element={
                <PatientDetails
                  patients={patients}
                  medicalNotes={medicalNotes}
                  onAddNote={handleAddNote}
                />
              } />
              <Route path="/discharge" element={
                <DischargeList
                  patients={patients}
                  onRequestDischarge={handleRequestDischarge}
                />
              } />
              <Route path="/discharge/:id" element={
                <DischargePatient
                  patients={patients}
                  onDischarge={handleDischargePatient}
                />
              } />
              <Route path="/reports" element={<DailyReportComponent report={generateDailyReport()} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;