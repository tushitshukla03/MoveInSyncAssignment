import { useState, useEffect } from 'react';
import Image from 'next/image';
import download from '../assets/download.png';

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState('completed');
  const [jsPDF, setJsPDF] = useState(null);
  const [QRCode, setQRCode] = useState(null);

  // Colors for PDF
  const colors = {
    primary: [220, 38, 38],    // Red (matches your UI)
    secondary: [37, 99, 235],  // Blue
    dark: [31, 41, 55],       // Dark gray
    gray: [107, 114, 128],    // Medium gray
    light: [249, 250, 251],   // Light background
  };

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        const jsPDFModule = await import('jspdf');
        const QRCodeModule = await import('qrcode');
        await import('jspdf-autotable');
        
        setJsPDF(() => jsPDFModule.default);
        setQRCode(() => QRCodeModule.default);
      } catch (error) {
        console.error('Error loading libraries:', error);
      }
    };

    loadLibraries();
  }, []);

  const trips = {
    booked: [],
    cancelled: [],
    completed: [
      {
        date: '13',
        day: 'Tuesday',
        monthYear: 'Aug 2024',
        route: 'Ahmedabad – Kodinar',
        company: 'Madhuram Travels',
        boarding: 'Sahyog Travels S T Stand',
        status: 'CONFIRMED',
        rated: 'Not Rated',
        ticketNumber: 'MT24081301',
      },
      {
        date: '06',
        day: 'Thursday',
        monthYear: 'Jun 2024',
        route: 'Ahmedabad – Kodinar',
        company: 'Madhuram Travels',
        boarding: 'Sahyog Travels S T Stand',
        status: 'CONFIRMED',
        rated: 'Not Rated',
        ticketNumber: 'MT24060601',
      },
      {
        date: '30',
        day: 'Tuesday',
        monthYear: 'Apr 2024',
        route: 'Ahmedabad – Kodinar',
        company: 'Madhuram Travels',
        boarding: 'Sahyog Travels S T Stand',
        status: 'CONFIRMED',
        rated: 'Not Rated',
        ticketNumber: 'MT24043001',
      },
    ],
  };

  const handleDownload = async (trip) => {
    try {
      if (!jsPDF || !QRCode) {
        console.error('Libraries not loaded yet');
        return;
      }

      // Create new document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({
        ticketNumber: trip.ticketNumber,
        route: trip.route,
        date: `${trip.date} ${trip.monthYear}`,
        boarding: trip.boarding,
      }));

      // Header section with brand color background
      doc.setFillColor(...colors.light);
      doc.roundedRect(15, 15, 180, 40, 3, 3, 'F');

      // Add a decorative color bar
      doc.setFillColor(...colors.primary);
      doc.rect(15, 15, 5, 40, 'F');

      // Company name with primary color
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(...colors.primary);
      doc.text(trip.company, 25, 32);

      // E-Ticket subtitle with secondary color
      doc.setFontSize(16);
      doc.setTextColor(...colors.secondary);
      doc.text('E-Ticket', 25, 42);

      // Add QR code
      doc.addImage(qrCodeDataUrl, 'PNG', 145, 17, 35, 35);

      // Ticket number section
      doc.setFontSize(12);
      doc.setTextColor(...colors.gray);
      doc.text('Ticket Number:', 20, 70);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.dark);
      doc.text(trip.ticketNumber, 60, 70);

      // Journey details section with subtle background
      doc.setFillColor(...colors.light);
      doc.roundedRect(15, 80, 180, 75, 3, 3, 'F');

      // Section title with primary color
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...colors.primary);
      doc.text('Journey Details', 20, 90);

      // Journey details table with enhanced styling
      doc.autoTable({
        startY: 95,
        margin: { left: 20, right: 20 },
        styles: {
          fontSize: 12,
          cellPadding: 6,
          textColor: colors.dark,
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { 
            fontStyle: 'bold', 
            cellWidth: 45,
            textColor: colors.secondary,
          },
          1: { 
            cellWidth: 115,
            textColor: colors.dark,
          },
        },
        body: [
          ['Date', `${trip.date} ${trip.monthYear} (${trip.day})`],
          ['Route', trip.route],
          ['Boarding', trip.boarding],
          ['Status', trip.status],
        ],
        theme: 'plain',
        didDrawCell: (data) => {
          // Add subtle separator lines
          if (data.row.index < data.table.body.length - 1) {
            doc.setDrawColor(...colors.light);
            doc.line(
              data.cell.x,
              data.cell.y + data.cell.height,
              data.cell.x + data.cell.width,
              data.cell.y + data.cell.height
            );
          }
        },
      });

      // Add a status indicator
      doc.setFillColor(...colors.light);
      doc.roundedRect(15, 165, 180, 20, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Status:', 20, 177);
      doc.setTextColor(39, 174, 96); // Green color for CONFIRMED status
      doc.text(trip.status, 45, 177);

      // Footer with subtle styling
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(...colors.light);
      doc.rect(0, pageHeight - 30, doc.internal.pageSize.width, 30, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...colors.gray);
      doc.text('This is an electronically generated ticket.', 20, pageHeight - 15);
      
      // Add validation text
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text('Valid for travel date: ', 20, pageHeight - 20);
      doc.text(`${trip.date} ${trip.monthYear}`, 70, pageHeight - 20);

      // Save the PDF
      doc.save(`${trip.company}-Ticket-${trip.ticketNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Tab Navigation */}
      <div className="flex justify-center bg-white shadow">
        {['booked', 'cancelled', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-1/3 py-2 text-center font-semibold ${
              activeTab === tab ? 'text-red-600 border-b-4 border-red-600' : 'text-gray-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Trip List */}
      <div className="p-4">
        {trips[activeTab].length > 0 ? (
          trips[activeTab].map((trip, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-start"
            >
              <div>
                <div className="text-red-600 font-bold text-2xl">{trip.date}</div>
                <div className="text-gray-500">{trip.day}</div>
                <div className="text-gray-500">{trip.monthYear}</div>
              </div>
              <div className="flex-grow ml-4">
                <div className="font-semibold">{trip.route}</div>
                <div className="text-gray-500">{trip.company}</div>
                <div className="text-gray-500">Boarding: {trip.boarding}</div>
                <div className="text-xs text-gray-400 mt-1">Ticket: {trip.ticketNumber}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-green-500 font-bold mb-2 m-auto">{trip.status}</div>
                <button
                  onClick={() => handleDownload(trip)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <Image src={download} alt="Download Ticket" width={20} height={20} />
                  <span>Download Ticket</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No trips available in this section</div>
        )}
      </div>
    </div>
  );
}