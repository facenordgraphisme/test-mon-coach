import { Stack, Text, Button, Card, TextArea, Label, Flex, Spinner } from '@sanity/ui'
import { useCallback, useState, useEffect } from 'react'
import { useClient, useFormValue } from 'sanity'

const convertEmbedToMapLink = (embedUrl: string): string => {
    if (!embedUrl) return ''
    
    // Si ce n'est pas un lien Google Maps Embed classique, on le retourne tel quel
    if (!embedUrl.includes('google.com/maps/embed') && !embedUrl.includes('google.com/maps/pb')) {
        return embedUrl
    }
    
    try {
        // Extraction de la latitude (!3d...) et de la longitude (!2d...)
        const latMatch = embedUrl.match(/!3d(-?\d+(?:\.\d+)?)/)
        const lngMatch = embedUrl.match(/!2d(-?\d+(?:\.\d+)?)/)
        
        if (latMatch && lngMatch) {
            const lat = latMatch[1]
            const lng = lngMatch[1]
            return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        }
    } catch (e) {
        console.error("Error parsing Google Maps Embed URL", e)
    }
    
    return embedUrl
}

export const StudioSmsInput = (props: any) => {
    // accessing document fields reliably using useFormValue
    // "phone" and "customerName" are at the root
    const phone = useFormValue(['phone']) as string
    const name = useFormValue(['customerName']) as string
    const event = useFormValue(['event']) as any
    const quantity = useFormValue(['quantity']) as number

    // safe access to ref
    const eventRef = event?._ref

    // Use the correct API version for your project
    const client = useClient({ apiVersion: '2024-01-01' })

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Fetch event details to build a better message
    useEffect(() => {
        if (!eventRef) {
            setMessage(`Bonjour ${name || ''}, voici les infos pour votre réservation.`)
            return
        }

        const fetchEvent = async () => {
            setLoading(true)
            try {
                // Fetch fields needed for the message
                const eventDoc = await client.fetch(`*[_type == "event" && _id == $id][0]{
                    title,
                    date,
                    locationInfo,
                    locationEmbedUrl,
                    activity->{title}
                }`, { id: eventRef })

                if (eventDoc) {
                    const dateObj = new Date(eventDoc.date)
                    const dateStr = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                    const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

                    const activityName = eventDoc.activity?.title || eventDoc.title || 'Votre activité'
                    
                    const mapLink = eventDoc.locationEmbedUrl ? convertEmbedToMapLink(eventDoc.locationEmbedUrl) : ''
                    
                    let locationText = eventDoc.locationInfo || 'voir confirmation'
                    if (mapLink) {
                        if (locationText.includes("de la carte ci-dessous")) {
                            locationText = locationText.replace("de la carte ci-dessous", `de la carte : ${mapLink}`)
                        } else if (locationText.includes("la carte ci-dessous")) {
                            locationText = locationText.replace("la carte ci-dessous", `la carte : ${mapLink}`)
                        } else {
                            locationText = `${locationText.trim()} Carte : ${mapLink}`
                        }
                    }

                    const location = `Lieu: ${locationText}`
                    const participantsText = quantity ? ` (${quantity} pers.)` : ''

                    const locationTrimmed = location.trim()
                    const separator = locationTrimmed.endsWith('.') ? '' : '.'
                    const msg = `Bonjour ${name || ''}, rappel pour votre séance : ${activityName}${participantsText} le ${dateStr} à ${timeStr}. ${locationTrimmed}${separator} À très vite ! Fred de Rêves D'aventures`
                    setMessage(msg)
                }
            } catch (error) {
                console.error("Error fetching event", error)
                setMessage(`Bonjour ${name || ''}, voici les infos pour votre réservation.`)
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [eventRef, name, quantity, client])

    const handleClick = useCallback(() => {
        if (!phone) {
            alert('Pas de téléphone')
            return
        }
        // Open the default SMS app with the pre-filled body
        window.open(`sms:${phone}?&body=${encodeURIComponent(message)}`, '_blank')
    }, [phone, message])

    return (
        <Card padding={3} border radius={2}>
            <Stack space={3}>
                <Flex align="center" justify="space-between">
                    <Text size={1} weight="bold">Prévisualisation SMS</Text>
                    {loading && <Spinner size={1} />}
                </Flex>

                <TextArea
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    rows={4}
                    placeholder="Le message s'affichera ici..."
                    style={{ fontSize: '14px' }}
                />

                <Button
                    text={phone ? `Envoyer au ${phone}` : "Pas de numéro de téléphone"}
                    tone="primary"
                    onClick={handleClick}
                    disabled={!phone}
                />

                {!phone && (
                    <Text size={1} style={{ color: 'red' }}>
                        Ajoutez un numéro de téléphone au client pour activer l'envoi.
                    </Text>
                )}
            </Stack>
        </Card>
    )
}
