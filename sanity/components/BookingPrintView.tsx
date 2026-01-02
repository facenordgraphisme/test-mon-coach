import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { User, Calendar, MapPin, Mail, Phone, CreditCard, Printer, Download } from 'lucide-react'

// Define types for the data we'll fetch
interface BookingData {
    _id: string
    _createdAt: string
    customerName: string
    email: string
    phone: string
    quantity: number
    price: number
    status: 'pending' | 'confirmed' | 'cancelled'
    stripeSessionId?: string
    medicalInfo?: string
    height?: string
    weight?: string
    participantsNames?: string
    event?: {
        date: string
        activity?: {
            title: string
            location?: string
            duration?: string
        }
    }
}

export function BookingPrintView({ documentId }: { documentId: string }) {
    const [booking, setBooking] = useState<BookingData | null>(null)
    const [loading, setLoading] = useState(true)
    const client = useClient({ apiVersion: '2024-01-01' })

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const query = `*[_type == "booking" && _id == $id][0]{
          _id,
          _createdAt,
          customerName,
          email,
          phone,
          quantity,
          price,
          status,
          stripeSessionId,
          medicalInfo,
          height,
          weight,
          participantsNames,
          event->{
            date,
            activity->{
              title,
              location,
              duration
            }
          }
        }`
                const data = await client.fetch(query, { id: documentId })
                setBooking(data)
            } catch (error) {
                console.error('Error fetching booking:', error)
            } finally {
                setLoading(false)
            }
        }

        if (documentId) {
            fetchBooking()
        }
    }, [documentId, client])

    if (loading) {
        return <div className="p-10 flex justify-center">Chargement des données...</div>
    }

    if (!booking) {
        return <div className="p-10 text-red-500">Réservation introuvable.</div>
    }

    const handlePrint = () => {
        const printContent = document.getElementById('printable-content');
        if (!printContent) return;

        const win = window.open('', '_blank', 'height=800,width=1000');
        if (!win) return;

        win.document.write('<html><head><title>Réservation - Mon Coach</title>');

        // Attempt to copy styles (Tailwind + Sanity styles)
        // This is tricky for external sheets, but let's try copying all style tags and links
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(node => {
            win.document.head.appendChild(node.cloneNode(true));
        });

        // Add specific print styles for the new window
        win.document.write(`
      <style>
        body { margin: 0; padding: 20px; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-hidden { display: none !important; }
        /* Ensure tailwind utility reset */
        * { box-sizing: border-box; }
      </style>
    `);

        win.document.write('</head><body>');
        win.document.write(printContent.innerHTML);
        win.document.write('</body></html>');

        win.document.close();

        // Wait for resources to load before printing
        setTimeout(() => {
            win.focus();
            win.print();
        }, 500);
    }

    const handleCopy = () => {
        const content = document.getElementById('printable-content');
        if (!content) return;

        const range = document.createRange();
        range.selectNode(content);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);

        try {
            document.execCommand('copy');
            alert('Contenu copié ! Vous pouvez le coller dans Word ou un email.');
        } catch (err) {
            console.error('Erreur lors de la copie', err);
        }

        window.getSelection()?.removeAllRanges();
    }

    return (
        <div className="bg-white min-h-screen p-8 max-w-[210mm] mx-auto text-stone-800">
            {/* Controls */}
            <div className="mb-8 flex gap-4 border-b pb-4 print-hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-700 transition-colors"
                >
                    <Printer size={16} /> Imprimer (Nouvelle fenêtre)
                </button>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-stone-100 text-stone-700 px-4 py-2 rounded-md hover:bg-stone-200 transition-colors border border-stone-200"
                >
                    <Download size={16} /> Copier (Pour coller dans Word)
                </button>
            </div>

            <div id="printable-content">
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b pb-8">
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Réservation</h1>
                        <p className="text-stone-500 text-sm">Réf: {booking._id.slice(-8).toUpperCase()}</p>
                        <p className="text-stone-500 text-sm">Date: {new Date(booking._createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-stone-900">MON COACH</h2>
                        <div className="text-sm text-stone-500 mt-1">
                            <p>contact@moncoach.com</p>
                            <p>+33 6 00 00 00 00</p>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="mb-8 p-1"> {/* Padding ensures visual separation during copy */}
                    <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: '1px solid',
                        backgroundColor: booking.status === 'confirmed' ? '#f0fdf4' : booking.status === 'cancelled' ? '#fef2f2' : '#fefce8',
                        color: booking.status === 'confirmed' ? '#15803d' : booking.status === 'cancelled' ? '#b91c1c' : '#a16207',
                        borderColor: booking.status === 'confirmed' ? '#bbf7d0' : booking.status === 'cancelled' ? '#fecaca' : '#fde047'
                    }}>
                        {booking.status === 'confirmed' ? 'CONFIRMÉE' : booking.status === 'cancelled' ? 'ANNULÉE' : 'EN ATTENTE'}
                    </span>
                </div>

                {/* Grid Layout - Flex fallback for copy/paste compatibility */}
                <div className="flex flex-wrap gap-12 mb-12">
                    {/* Customer Info */}
                    <div className="flex-1 min-w-[250px]">
                        <h3 className="text-sm font-bold uppercase text-stone-400 mb-4 flex items-center gap-2">
                            <User size={14} /> Client
                        </h3>
                        <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                            <p className="font-bold text-lg mb-1">{booking.customerName}</p>
                            <p className="flex items-center gap-2 text-sm text-stone-600 mb-1">
                                <Mail size={12} /> {booking.email}
                            </p>
                            <p className="flex items-center gap-2 text-sm text-stone-600">
                                <Phone size={12} /> {booking.phone}
                            </p>
                        </div>
                    </div>

                    {/* Activity Info */}
                    <div className="flex-1 min-w-[250px]">
                        <h3 className="text-sm font-bold uppercase text-stone-400 mb-4 flex items-center gap-2">
                            <Calendar size={14} /> Activité
                        </h3>
                        <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                            <p className="font-bold text-lg mb-1">{booking.event?.activity?.title || 'Activité inconnue'}</p>
                            <p className="text-sm text-stone-600 mb-1">
                                Date : <span className="font-medium text-stone-900">
                                    {booking.event?.date ? new Date(booking.event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue'}
                                </span>
                            </p>
                            {booking.event?.activity?.location && (
                                <p className="flex items-center gap-2 text-sm text-stone-600">
                                    <MapPin size={12} /> {booking.event.activity.location}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Participants Details */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold uppercase text-stone-400 mb-4 border-b pb-2">Détails Participants</h3>
                    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-stone-50 text-stone-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3 w-16 border-b border-stone-200">Qté</th>
                                    <th className="px-4 py-3 border-b border-stone-200">Noms des participants</th>
                                    {(booking.height || booking.weight) && (
                                        <th className="px-4 py-3 border-b border-stone-200">Physique (Taille/Poids)</th>
                                    )}
                                    <th className="px-4 py-3 border-b border-stone-200">Infos Médicales / Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                <tr>
                                    <td className="px-4 py-3 font-bold text-center align-top border-b border-stone-100">{booking.quantity}</td>
                                    <td className="px-4 py-3 align-top border-b border-stone-100">
                                        {booking.participantsNames ? (
                                            <ul className="list-disc ml-4 space-y-1">
                                                {booking.participantsNames.split('|').map((name, i) => (
                                                    <li key={i}>{name.replace(/P\d+:\s*/, '').trim()}</li>
                                                ))}
                                            </ul>
                                        ) : '-'}
                                    </td>
                                    {(booking.height || booking.weight) && (
                                        <td className="px-4 py-3 align-top border-b border-stone-100">
                                            <div className="space-y-1">
                                                {booking.height && (
                                                    <div className="text-xs">
                                                        <span className="font-medium text-stone-500">Taille:</span>
                                                        <div className="ml-2">{booking.height.split('|').map(h => h.trim()).join(', ')}</div>
                                                    </div>
                                                )}
                                                {booking.weight && (
                                                    <div className="text-xs">
                                                        <span className="font-medium text-stone-500">Poids:</span>
                                                        <div className="ml-2">{booking.weight.split('|').map(w => w.trim()).join(', ')}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-4 py-3 text-stone-600 align-top max-w-xs border-b border-stone-100">
                                        {booking.medicalInfo ? (
                                            <ul className="list-disc ml-4 space-y-1 text-xs">
                                                {booking.medicalInfo.split('|').map((info, i) => (
                                                    <li key={i}>{info.replace(/P\d+:\s*/, '').trim()}</li>
                                                ))}
                                            </ul>
                                        ) : 'R.A.S'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Financials */}
                <div className="flex justify-end">
                    <div className="w-64">
                        <div className="flex justify-between items-center py-2 border-b border-stone-100">
                            <span className="text-stone-500 text-sm">Sous-total</span>
                            <span className="text-stone-900 font-medium">{booking.price.toFixed(2)} €</span>
                        </div>

                        <div className="flex justify-between items-center py-4">
                            <span className="text-lg font-bold text-stone-900">Total Payé</span>
                            <span className="text-xl font-bold text-stone-900">{booking.price.toFixed(2)} €</span>
                        </div>

                        {booking.stripeSessionId && (
                            <div className="mt-2 text-right">
                                <p className="text-xs text-stone-400 flex items-center justify-end gap-1">
                                    <CreditCard size={10} /> Stripe ID
                                </p>
                                <p className="text-[10px] text-stone-400 font-mono truncate max-w-full">
                                    {booking.stripeSessionId}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer for print */}
                <div className="mt-16 pt-8 border-t text-center text-xs text-stone-400">
                    <p>Document généré le {new Date().toLocaleDateString('fr-FR')} - Mon Coach</p>
                </div>
            </div>
        </div>
    )
}
