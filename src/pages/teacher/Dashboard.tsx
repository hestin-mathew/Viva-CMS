import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SubjectList from './components/SubjectList';
import QuestionGenerator from './QuestionGenerator';
import ResultsView from './ResultsView';

const TeacherDashboard = () => {
  return (
    <Routes>
      <Route index element={<SubjectList />} />
      <Route path="questions" element={<QuestionGenerator />} />
      <Route path="results" element={<ResultsView />} />
    </Routes>
  );
};

export default TeacherDashboard;