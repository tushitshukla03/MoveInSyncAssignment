import { useState, useEffect } from 'react';
import Image from 'next/image';
import download from '../assets/download.png';
import cancel from '../assets/cancel.png';
import { useSelector } from 'react-redux';
import { selectUser } from '../utils/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [jsPDF, setJsPDF] = useState(null);
  const [QRCode, setQRCode] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);

  // Colors for PDF
  const colors = {
    primary: [220, 38, 38],    // Red
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user-trips/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const groupBookingsByStatus = (bookings) => {
    const today = new Date();
    return bookings.reduce((acc, order) => {
      // Initialize status as 'cancelled' if order status is Cancelled
      if (order.status === 'Cancelled') {
        if (!acc['cancelled']) {
          acc['cancelled'] = [];
        }
        acc['cancelled'].push(order);
        return acc;
      }

      // Skip if no bookings (shouldn't happen for non-cancelled orders, but just in case)
      if (!order.bookings || order.bookings.length === 0) {
        return acc;
      }

      const tripDate = new Date(order.bookings[0].trip.date);
      const status = tripDate > today ? 'upcoming' : 'completed';

      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(order);
      return acc;
    }, { upcoming: [], completed: [], cancelled: [] });
  };

  const handleDownload = async (order) => {
    try {
      if (!jsPDF || !QRCode) {
        console.error('Libraries not loaded yet');
        return;
      }

      // Handle cancelled orders with no bookings
      if (!order.bookings || order.bookings.length === 0) {
        toast.error('Cannot download ticket for cancelled order');
        return;
      }

      const trip = order.bookings[0].trip;
      const ticketNumber = `${trip.company.substring(0, 2)}${trip.date.replace(/-/g, '')}${order.id}`;

      // Create new document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({
        orderID: order.id,
        route: trip.route,
        date: `${trip.date}`,
        boarding: trip.boarding,
        seats: order.bookings.map(b => b.seat.seat_number).join(', ')
      }));

      // Header section
      doc.setFillColor(...colors.light);
      doc.roundedRect(15, 15, 180, 40, 3, 3, 'F');

      // Add a decorative color bar
      doc.setFillColor(...colors.primary);
      doc.rect(15, 15, 5, 40, 'F');

      // Company name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(...colors.primary);
      doc.text(trip.company, 25, 32);

      // E-Ticket subtitle
      doc.setFontSize(16);
      doc.setTextColor(...colors.secondary);
      doc.text('E-Ticket', 25, 42);

      // Add QR code
      doc.addImage(qrCodeDataUrl, 'PNG', 145, 17, 35, 35);

      // Journey details section
      doc.setFillColor(...colors.light);
      doc.roundedRect(15, 80, 180, 100, 3, 3, 'F');

      doc.autoTable({
        startY: 85,
        margin: { left: 20, right: 20 },
        styles: {
          fontSize: 12,
          cellPadding: 6,
          textColor: colors.dark,
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
          ['Date', `${trip.date} (${trip.day})`],
          ['Time', trip.route_time],
          ['Route', trip.route],
          ['Boarding', trip.boarding],
          ['Bus Number', trip.bus_number],
          ['Seats', order.bookings.map(b => b.seat.seat_number).join(', ')],
          ['Passengers', order.bookings.map(b => b.user_name).join(', ')],
          ['Status', order.status],
          ['Total Price', `₹${order.total_price}`],
        ],
        theme: 'plain',
      });

      // Save the PDF
      doc.save(`${trip.company}-Ticket-${ticketNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating ticket PDF');
    }
  };

  const handleCancelBooking = async (order) => {
    try {
        const response = await fetch(`http://localhost:8000/api/orders/${order.id}/cancel/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Optionally refetch bookings or update local state
      setBookings((prevBookings) => 
        prevBookings.map((b) =>
          b.id === order.id ? { ...b, status: 'Cancelled' } : b
        )
      );

      toast.success('Booking cancelled successfully!');
    } catch (error) {
      toast.error(`Error cancelling booking: ${error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const groupedBookings = groupBookingsByStatus(bookings);

  return (
    <div className="bg-gray-100 min-h-screen overflow-y-auto">
      <ToastContainer />
      {/* Tab Navigation */}
      <div className="flex justify-center bg-white shadow">
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
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

      {/* Bookings List */}
      <div className="p-4">
        {groupedBookings[activeTab].length > 0 ? (
          groupedBookings[activeTab].map((order) => {
            // For cancelled orders with no bookings, show basic info
            if (order.status === 'Cancelled' && (!order.bookings || order.bookings.length === 0)) {
              return (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-start"
                >
                  <div>
                    <div className="text-red-600 font-bold text-2xl">
                      {new Date(order.created_at).getDate().toString().padStart(2, '0')}
                    </div>
                    <div className="text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div className="text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex-grow ml-4">
                    <div className="font-semibold">Cancelled Order #{order.id}</div>
                    <div className="text-gray-500">{order.order_email}</div>
                    <div className="text-blue-600 font-semibold mb-2">
                      ₹{order.total_price}
                    </div>
                    <div className="text-red-600">Order Cancelled</div>
                  </div>
                </div>
              );
            }

            const trip = order.bookings[0].trip;
            const dateObj = new Date(trip.date);
            const day = dateObj.getDate().toString().padStart(2, '0');
            
            return (
              <div
                key={order.id}
                className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between"
              > <div className='flex space-x-10'>
                <div >
                  <div className="text-red-600 font-bold text-2xl">{day}</div>
                  <div className="text-gray-500">{trip.day}</div>
                  <div className="text-gray-500">{trip.monthYear}</div>
                </div>
                  <div className='mt-2'>
                    <div className="font-semibold">{trip.route}</div>
                    <div className="text-gray-500">{trip.company}</div>
                    <div className="text-blue-600 font-semibold mb-2">
                    ₹{order.total_price}
                    </div>
                  </div></div>
                  <div className=''>
                  {activeTab === 'upcoming' && order.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleCancelBooking(order)}
                      className="mt-2 text-red-600 flex  hover:text-red-800 text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors mr-2"
                    >
                      <Image src={cancel} alt="Cancel Booking" className='mr-2' width={20} height={20} />
                      <span>Cancel Booking</span>
                    </button>
                  )}
                  {order.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleDownload(order)}
                      className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Image src={download} alt="Download Ticket" width={20} height={20} />
                      <span>Download Ticket</span>
                    </button>
                  )}
                  </div>
                </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-8">No bookings found.</div>
        )}
      </div>
    </div>
  );
}