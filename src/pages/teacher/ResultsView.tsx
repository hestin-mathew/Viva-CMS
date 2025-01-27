import React, { useState } from 'react';
import SubjectSelector from './components/SubjectSelector';
import SearchBar from './components/SearchBar';
import ResultsTable from './components/ResultsTable';

const ResultsView = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API calls
  const results = [
    {
      id: '1',
      studentName: 'Hestin  Mathew Xavier',
      studentId: 'STDT17',
      score: 15,
      totalQuestions: 20,
      submittedAt: '2024-03-15T10:30:00',
    },
  ];

  const filteredResults = results.filter(result => 
    result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">View Results</h1>

      <SubjectSelector
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search students..."
      />

      <ResultsTable results={filteredResults} />
    </div>
  );
};

export default ResultsView;