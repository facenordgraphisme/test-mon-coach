import { type StructureBuilder } from 'sanity/structure'
import {
    Home,
    Map,
    BookOpen,
    Settings,
    CalendarDays,
    Bike,
    Activity,
    Zap,
    Tags,
    TicketCheck,
    User,
    MessageSquare,
    FileText
} from 'lucide-react'
import { BookingPrintView } from './components/BookingPrintView'

export const structure = (S: StructureBuilder) =>
    S.list()
        .title('Contenu')
        .items([
            // --- GROUPE 1 : PAGES & CONTENU ---
            S.listItem()
                .title('Pages & Contenu Site')
                .icon(FileText)
                .child(
                    S.list()
                        .title('Pages & Contenu Site')
                        .items([
                            // 1. Page d'accueil
                            S.listItem()
                                .title("Page d'accueil")
                                .icon(Home)
                                .child(
                                    S.document()
                                        .schemaType('homepage')
                                        .documentId('homepage')
                                        .title("Page d'accueil")
                                ),
                            // 2. Page Mono-Activité
                            S.listItem()
                                .title("Page Mono-Activité")
                                .icon(Zap)
                                .child(
                                    S.document()
                                        .schemaType('monoActivitePage')
                                        .documentId('monoActivitePage')
                                        .title("Page Mono-Activité")
                                ),
                            // 3. Page Duo-Activités
                            S.listItem()
                                .title("Page Duo-Activités")
                                .icon(Tags)
                                .child(
                                    S.document()
                                        .schemaType('duoActivitesPage')
                                        .documentId('duoActivitesPage')
                                        .title("Page Duo-Activités")
                                ),
                            // 4. Page Sur-Mesure
                            S.listItem()
                                .title("Page Sur-Mesure")
                                .icon(Map)
                                .child(
                                    S.document()
                                        .schemaType('surMesurePage')
                                        .documentId('surMesurePage')
                                        .title("Page Sur-Mesure")
                                ),
                            // 5. Page Calendrier
                            S.listItem()
                                .title('Page Calendrier')
                                .child(
                                    S.document()
                                        .schemaType('calendarPage')
                                        .documentId('pageCalendrier')
                                ),
                            // 6. Page Profil Guide (List)
                            S.documentTypeListItem('guide')
                                .title('Page Profil Guide')
                                .icon(User),

                            // 7. Page Contact
                            S.listItem()
                                .title("Page Contact")
                                .icon(MessageSquare)
                                .child(
                                    S.document()
                                        .schemaType('contactPage')
                                        .documentId('contactPage')
                                        .title("Page Contact")
                                ),
                            // 8. Page Niveaux
                            S.listItem()
                                .title("Page Niveaux")
                                .icon(Zap)
                                .child(
                                    S.document()
                                        .schemaType('levelsPage')
                                        .documentId('levelsPage')
                                        .title("Page Niveaux")
                                ),
                            // 9. Page Accès
                            S.listItem()
                                .title("Page Accès")
                                .icon(Map)
                                .child(
                                    S.document()
                                        .schemaType('accessPage')
                                        .documentId('accessPage')
                                        .title("Page Accès")
                                ),
                            // 10. Page Avis Client (Singleton)
                            S.listItem()
                                .title('Page Avis Client')
                                .icon(MessageSquare)
                                .child(
                                    S.document()
                                        .schemaType('reviewsPage')
                                        .documentId('reviewsPage')
                                        .title('Page Avis Client')
                                ),
                            // 11. Page Mentions Légales
                            S.listItem()
                                .title("Page Mentions Légales")
                                .icon(FileText)
                                .child(
                                    S.document()
                                        .schemaType('legalPage')
                                        .documentId('legalPage')
                                        .title("Mentions Légales")
                                ),
                            // 12. Page CGV
                            S.listItem()
                                .title("Page CGV")
                                .icon(FileText)
                                .child(
                                    S.document()
                                        .schemaType('cgvPage')
                                        .documentId('cgvPage')
                                        .title("Conditions Générales de Vente")
                                ),

                            S.divider(),
                            // 13. Paramètres Footer / Réseaux
                            S.listItem()
                                .title("Paramètres du Site (Footer)")
                                .icon(Settings)
                                .child(
                                    S.document()
                                        .schemaType('siteSettings')
                                        .documentId('siteSettings')
                                        .title("Paramètres du Site")
                                ),
                        ])
                ),

            S.divider(),

            // --- GROUPE 2 : GESTION ACTIVITÉS & PLANNING ---
            S.listItem()
                .title('Activités & Planning')
                .icon(CalendarDays)
                .child(
                    S.list()
                        .title('Activités & Planning')
                        .items([
                            S.documentTypeListItem('event').title('Séances (Calendrier)').icon(CalendarDays),
                            S.divider(),
                            S.documentTypeListItem('activity').title('Activités').icon(Activity),
                            S.documentTypeListItem('bike').title('Vélos (Matériel)').icon(Bike),

                            S.divider(),
                            S.documentTypeListItem('review').title('Avis Clients (Data)').icon(MessageSquare),
                            S.documentTypeListItem('difficulty').title('Niveaux de difficulté').icon(Zap),
                            S.documentTypeListItem('category').title('Catégories').icon(Tags),
                        ])
                ),

            S.divider(),

            // --- GROUPE 3 : RÉSERVATIONS ---
            S.documentTypeListItem('booking')
                .title('Réservations')
                .icon(TicketCheck)
                .child(
                    S.documentTypeList('booking')
                        .title('Réservations')
                        .child(documentId =>
                            S.document()
                                .documentId(documentId)
                                .schemaType('booking')
                                .views([
                                    S.view.form(),
                                    S.view.component(BookingPrintView).title('Imprimer / Export')
                                ])
                        )
                ),
        ])
