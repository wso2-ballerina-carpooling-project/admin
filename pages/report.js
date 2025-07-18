// 📁 Project: Next.js Admin Report Page with PDF + CSV Export + Filters + Email
import { useEffect, useState, useRef } from 'react';

export default function ReportPage() {
  const [reportData, setReportData] = useState(null);
  const [filteredRides, setFilteredRides] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [driverFilter, setDriverFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const reportRef = useRef();

  useEffect(() => {
    fetch('http://localhost:9090/api/reports/admin')
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        setFilteredRides(data.rides);
      });
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Admin Report</h1>
    </div>
  );
}
