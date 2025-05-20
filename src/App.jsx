import React, { useState } from 'react';
import GenerateReportButton from './components/GenerateReportButton';
import './Mimi.css';


const App = () => {
  const [orgUnit, setOrgUnit] = useState(null);
  const [period, setPeriod] = useState(null);

  return (
    <div className="app-container">
     
      <GenerateReportButton orgUnit={orgUnit} period={period} />
    </div>
  );
};

export default App;