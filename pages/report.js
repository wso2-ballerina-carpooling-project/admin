// 📁 Project: Next.js Admin Report Page with PDF + CSV Export + Filters + Email

import { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

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

  useEffect(() => {
    if (!reportData) return;
    let rides = reportData.rides;

    if (selectedMonth !== 'All') {
      rides = rides.filter(r => {
        const rideMonth = new Date(r.date).toLocaleString('default', { month: 'long' });
        return rideMonth === selectedMonth;
      });
    }

    if (driverFilter) {
      rides = rides.filter(r => r.driver.toLowerCase().includes(driverFilter.toLowerCase()));
    }

    if (startDate && endDate) {
      rides = rides.filter(r => {
        const date = new Date(r.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    setFilteredRides(rides);
  }, [selectedMonth, driverFilter, startDate, endDate, reportData]);

  const generatePDF = () => {
    html2pdf().from(reportRef.current)
      .set({ filename: 'admin-report.pdf', html2canvas: { scale: 2 } })
      .save();
  };

  const exportCSV = () => {
    let csv = "From,To,Driver,Date\n";
    filteredRides.forEach(r => {
      csv += `${r.from},${r.to},${r.driver},${r.date}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "admin-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const emailReport = () => {
    alert("Email sent! (This is a placeholder. Connect to backend to implement actual sending.)");
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Admin Report</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Filter by Month: </label>
        <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth} style={{ padding: '4px', marginRight: '10px' }}>
          <option>All</option>
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ].map(month => <option key={month}>{month}</option>)}
        </select>

        <label>Driver: </label>
        <input type="text" placeholder="Search by driver" value={driverFilter} onChange={e => setDriverFilter(e.target.value)} style={{ padding: '4px', marginRight: '10px' }} />

        <label>Date From: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ marginRight: '10px' }} />

        <label>To: </label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ marginRight: '10px' }} />

        <button onClick={generatePDF} style={{ marginRight: 10, padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Download PDF</button>
        <button onClick={exportCSV} style={{ marginRight: 10, padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Export CSV</button>
        <button onClick={emailReport} style={{ padding: '6px 12px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}>Email Report</button>
      </div>

      <div ref={reportRef} id="pdf-content" style={{ background: 'white', padding: 20, border: '1px solid #ccc' }}>
        {reportData && (
          <>
            <h2>Total Rides: {reportData.totalRides}</h2>
            <h3>Filtered Rides: {filteredRides.length}</h3>

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f8f8' }}>
                  <th>From</th><th>To</th><th>Driver</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRides.map((ride, i) => (
                  <tr key={i}>
                    <td>{ride.from}</td>
                    <td>{ride.to}</td>
                    <td>{ride.driver}</td>
                    <td>{ride.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
