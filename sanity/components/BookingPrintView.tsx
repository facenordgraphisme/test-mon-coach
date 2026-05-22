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

interface SiteSettings {
    siteTitle?: string
    email?: string
    phone?: string
    address?: string
}

interface ContactPage {
    email?: string
    phone?: string
}

export function BookingPrintView({ documentId }: { documentId: string }) {
    const [booking, setBooking] = useState<BookingData | null>(null)
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [contact, setContact] = useState<ContactPage | null>(null)
    const [loading, setLoading] = useState(true)
    const client = useClient({ apiVersion: '2024-01-01' })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingQuery = `*[_type == "booking" && _id == $id][0]{
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
                const settingsQuery = `*[_type == "siteSettings"][0]{
                  siteTitle,
                  email,
                  phone,
                  address
                }`
                const contactQuery = `*[_type == "contactPage"][0]{
                  email,
                  phone
                }`
                
                const [bookingData, settingsData, contactData] = await Promise.all([
                    client.fetch(bookingQuery, { id: documentId }),
                    client.fetch(settingsQuery),
                    client.fetch(contactQuery)
                ])
                
                setBooking(bookingData)
                setSettings(settingsData)
                setContact(contactData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (documentId) {
            fetchData()
        }
    }, [documentId, client])

    if (loading) {
        return <div className="p-10 flex justify-center">Chargement des données...</div>
    }

    if (!booking) {
        return <div className="p-10 text-red-500">Réservation introuvable.</div>
    }

    const siteTitle = settings?.siteTitle || "Rêves d'Aventures"

    const handlePrint = () => {
        const printContent = document.getElementById('printable-content');
        if (!printContent) return;

        const win = window.open('', '_blank', 'height=800,width=1000');
        if (!win) return;

        win.document.write(`<html><head><title>Réservation - ${siteTitle}</title>`);

        // Attempt to copy styles (Tailwind + Sanity styles)
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
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-medium"
                    style={{ backgroundColor: '#0C4730' }}
                >
                    <Printer size={16} /> Imprimer (Nouvelle fenêtre)
                </button>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-stone-100 text-stone-700 px-4 py-2 rounded-md hover:bg-stone-200 transition-colors border border-stone-200 font-medium"
                >
                    <Download size={16} /> Copier (Pour coller dans Word)
                </button>
            </div>

            <div id="printable-content">
                {/* Header */}
                <div className="flex justify-between items-center mb-12 border-b-2 pb-8" style={{ borderBottomColor: '#0C4730' }}>
                    <div className="flex items-center gap-4">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                                src="/assets/logo-v2.png" 
                                alt={siteTitle} 
                                style={{ height: '60px', width: 'auto', objectFit: 'contain', display: 'block' }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <div>
                                <h2 className="text-xl font-black tracking-wider text-stone-900 uppercase" style={{ color: '#0C4730', fontFamily: 'system-ui, sans-serif' }}>
                                    {siteTitle}
                                </h2>
                                <p className="text-xs font-semibold text-stone-500 tracking-widest">
                                    WWW.REVESDAVENTURES.FR
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right text-sm text-stone-600">
                        <h1 className="text-xl font-black uppercase tracking-wider mb-2" style={{ color: '#0C4730' }}>Facture / Réservation</h1>
                        <p className="font-semibold text-stone-800">Réf : <span className="font-mono">{booking._id.slice(-8).toUpperCase()}</span></p>
                        <p className="text-xs text-stone-500">Créé le {new Date(booking._createdAt).toLocaleDateString('fr-FR')}</p>
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
                        backgroundColor: booking.status === 'confirmed' ? '#e6f4ea' : booking.status === 'cancelled' ? '#fce8e6' : '#fef7e0',
                        color: booking.status === 'confirmed' ? '#137333' : booking.status === 'cancelled' ? '#c5221f' : '#b06000',
                        borderColor: booking.status === 'confirmed' ? '#ceead6' : booking.status === 'cancelled' ? '#fad2cf' : '#fde293'
                    }}>
                        {booking.status === 'confirmed' ? 'CONFIRMÉE' : booking.status === 'cancelled' ? 'ANNULÉE' : 'EN ATTENTE'}
                    </span>
                </div>

                {/* Grid Layout - Flex fallback for copy/paste compatibility */}
                <div className="flex flex-wrap gap-6 mb-12">
                    {/* Customer Info */}
                    <div className="flex-1 min-w-[220px]">
                        <h3 className="text-sm font-bold uppercase mb-4 flex items-center gap-2" style={{ color: '#17624A' }}>
                            <User size={14} style={{ color: '#0C4730' }} /> Client
                        </h3>
                        <div className="p-4 rounded-lg border" style={{ backgroundColor: '#F3EFE7', borderColor: '#E9E3D6' }}>
                            <p className="font-bold text-base mb-1" style={{ color: '#0C4730' }}>{booking.customerName}</p>
                            <p className="flex items-center gap-2 text-xs text-stone-600 mb-1">
                                <Mail size={12} style={{ color: '#0C4730' }} /> {booking.email}
                            </p>
                            <p className="flex items-center gap-2 text-xs text-stone-600">
                                <Phone size={12} style={{ color: '#0C4730' }} /> {booking.phone}
                            </p>
                        </div>
                    </div>

                    {/* Activity Info */}
                    <div className="flex-1 min-w-[220px]">
                        <h3 className="text-sm font-bold uppercase mb-4 flex items-center gap-2" style={{ color: '#17624A' }}>
                            <Calendar size={14} style={{ color: '#0C4730' }} /> Activité
                        </h3>
                        <div className="p-4 rounded-lg border" style={{ backgroundColor: '#F3EFE7', borderColor: '#E9E3D6' }}>
                            <p className="font-bold text-base mb-1" style={{ color: '#0C4730' }}>{booking.event?.activity?.title || 'Activité inconnue'}</p>
                            <p className="text-xs text-stone-600 mb-1">
                                Date : <span className="font-semibold text-stone-900">
                                    {booking.event?.date ? new Date(booking.event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue'}
                                </span>
                            </p>
                            {booking.event?.activity?.location && (
                                <p className="flex items-center gap-2 text-xs text-stone-600">
                                    <MapPin size={12} style={{ color: '#0C4730' }} /> {booking.event.activity.location}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Provider Info */}
                    <div className="flex-1 min-w-[220px]">
                        <h3 className="text-sm font-bold uppercase mb-4 flex items-center gap-2" style={{ color: '#17624A' }}>
                            <User size={14} style={{ color: '#0C4730' }} /> Préstataire
                        </h3>
                        <div className="p-4 rounded-lg border" style={{ backgroundColor: '#F3EFE7', borderColor: '#E9E3D6' }}>
                            <p className="font-bold text-base mb-1" style={{ color: '#0C4730' }}>{siteTitle}</p>
                            <p className="flex items-center gap-2 text-xs text-stone-600 mb-1">
                                <Mail size={12} style={{ color: '#0C4730' }} /> {settings?.email || contact?.email || "contact@revesdaventures.fr"}
                            </p>
                            {(settings?.phone || contact?.phone) && (
                                <p className="flex items-center gap-2 text-xs text-stone-600 mb-1">
                                    <Phone size={12} style={{ color: '#0C4730' }} /> {settings?.phone || contact?.phone}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Participants Details */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold uppercase mb-4 border-b pb-2" style={{ color: '#17624A', borderColor: '#E9E3D6' }}>Détails Participants</h3>
                    <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#E9E3D6' }}>
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-white font-semibold" style={{ backgroundColor: '#0C4730' }}>
                                <tr>
                                    <th className="px-4 py-3 w-16 border-b" style={{ borderColor: '#E9E3D6', color: '#FFFFFF' }}>Qté</th>
                                    <th className="px-4 py-3 border-b" style={{ borderColor: '#E9E3D6', color: '#FFFFFF' }}>Noms des participants</th>
                                    {(booking.height || booking.weight) && (
                                        <th className="px-4 py-3 border-b" style={{ borderColor: '#E9E3D6', color: '#FFFFFF' }}>Physique (Taille/Poids)</th>
                                    )}
                                    <th className="px-4 py-3 border-b" style={{ borderColor: '#E9E3D6', color: '#FFFFFF' }}>Infos Médicales / Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: '#E9E3D6' }}>
                                <tr>
                                    <td className="px-4 py-3 font-bold text-center align-top border-b" style={{ borderColor: '#E9E3D6' }}>{booking.quantity}</td>
                                    <td className="px-4 py-3 align-top border-b" style={{ borderColor: '#E9E3D6' }}>
                                        {booking.participantsNames ? (
                                            <ul className="list-disc ml-4 space-y-1">
                                                {booking.participantsNames.split('|').map((name, i) => (
                                                    <li key={i}>{name.replace(/P\d+:\s*/, '').trim()}</li>
                                                ))}
                                            </ul>
                                        ) : '-'}
                                    </td>
                                    {(booking.height || booking.weight) && (
                                        <td className="px-4 py-3 align-top border-b" style={{ borderColor: '#E9E3D6' }}>
                                            <div className="space-y-1">
                                                {booking.height && (
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-stone-500">Taille:</span>
                                                        <div className="ml-2">{booking.height.split('|').map(h => h.trim()).join(', ')}</div>
                                                    </div>
                                                )}
                                                {booking.weight && (
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-stone-500">Poids:</span>
                                                        <div className="ml-2">{booking.weight.split('|').map(w => w.trim()).join(', ')}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-4 py-3 text-stone-600 align-top max-w-xs border-b" style={{ borderColor: '#E9E3D6' }}>
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
                <div className="flex justify-end mt-8">
                    <div className="w-64">
                        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#E9E3D6' }}>
                            <span className="text-stone-500 text-sm">Sous-total</span>
                            <span className="text-stone-900 font-semibold">{booking.price.toFixed(2)} €</span>
                        </div>

                        <div className="flex justify-between items-center py-4 border-b" style={{ borderColor: '#E9E3D6' }}>
                            <span className="text-lg font-bold text-stone-900">Total Payé</span>
                            <span className="text-xl font-bold" style={{ color: '#0C4730' }}>{booking.price.toFixed(2)} €</span>
                        </div>

                        {booking.stripeSessionId && (
                            <div className="mt-4 text-right">
                                <p className="text-[10px] text-stone-400 flex items-center justify-end gap-1 font-semibold">
                                    <CreditCard size={10} style={{ color: '#0C4730' }} /> Paiement Sécurisé Stripe
                                </p>
                                <p className="text-[9px] text-stone-400 font-mono truncate max-w-full">
                                    ID: {booking.stripeSessionId}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer for print */}
                <div className="mt-16 pt-8 border-t text-center text-xs text-stone-400" style={{ borderTopColor: '#E9E3D6' }}>
                    <p className="font-semibold" style={{ color: '#17624A' }}>
                        Merci pour votre confiance !
                    </p>
                    <p className="mt-1">
                        Document généré le {new Date().toLocaleDateString('fr-FR')} - {siteTitle} - www.revesdaventures.fr
                    </p>
                </div>
            </div>
        </div>
    )
}
