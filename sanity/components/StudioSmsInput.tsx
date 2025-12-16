import { Stack, Text, Button, Card } from '@sanity/ui'
import { useCallback } from 'react'
import { set, unset } from 'sanity'

export const StudioSmsInput = (props: any) => {
    const { value, renderDefault } = props
    const doc = props.parent

    // doc.phone and doc.customerName might not be available directly in props if not passed
    // We rely on the fact that this input will be used in the context of the document
    // Actually, best to use it as a field component where the value is the calculated link or just use the document data.

    const phone = doc?.phone
    const name = doc?.customerName
    const activityTitle = doc?.event?.title || "Sortie" // limitation: references might not be expanded

    // We can't easily get the Activity Title if it's a weak reference not expanded.
    // But we can just send a generic message.

    const handleClick = useCallback(() => {
        if (!phone) {
            alert('Pas de téléphone')
            return
        }

        const body = `Bonjour ${name || ''}, voici les infos pour votre sortie ${activityTitle}.`
        window.open(`sms:${phone}?body=${encodeURIComponent(body)}`, '_blank')
    }, [phone, name, activityTitle])

    return (
        <Card padding={3} border radius={2}>
            <Stack space={3}>
                <Text size={1} weight="bold">Action Rapide</Text>
                <Button
                    text="Envoyer SMS au client"
                    tone="primary"
                    onClick={handleClick}
                    disabled={!phone}
                />
            </Stack>
        </Card>
    )
}
