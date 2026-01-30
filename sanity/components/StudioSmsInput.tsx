import { Stack, Text, Button, Card, TextArea, Label, Flex, Spinner } from '@sanity/ui'
import { useCallback, useState, useEffect } from 'react'
import { useClient, useFormValue } from 'sanity'

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
                    activity->{title}
                }`, { id: eventRef })

                if (eventDoc) {
                    const dateObj = new Date(eventDoc.date)
                    const dateStr = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                    const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

                    const activityName = eventDoc.activity?.title || eventDoc.title || 'Votre activité'
                    const location = eventDoc.locationInfo ? `Lieu: ${eventDoc.locationInfo}` : 'Lieu: voir confirmation'
                    const participantsText = quantity ? ` (${quantity} pers.)` : ''

                    const msg = `Bonjour ${name || ''}, rappel pour votre séance : ${activityName}${participantsText} le ${dateStr} à ${timeStr}. ${location}. À très vite ! Fred de Rêves D'aventures`
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
