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
                            S.listItem()
                                .title("Page d'accueil")
                                .icon(Home)
                                .child(
                                    S.document()
                                        .schemaType('homepage')
                                        .documentId('homepage')
                                        .title("Page d'accueil")
                                ),
                            S.listItem()
                                .title("Page Niveaux")
                                .icon(Zap)
                                .child(
                                    S.document()
                                        .schemaType('levelsPage')
                                        .documentId('levelsPage')
                                        .title("Page Niveaux")
                                ),
                            S.listItem()
                                .title("Page Accès")
                                .icon(Map)
                                .child(
                                    S.document()
                                        .schemaType('accessPage')
                                        .documentId('accessPage')
                                        .title("Page Accès")
                                ),
                            S.listItem()
                                .title("Mentions Légales")
                                .icon(FileText)
                                .child(
                                    S.document()
                                        .schemaType('legalPage')
                                        .documentId('legalPage')
                                        .title("Mentions Légales")
                                ),
                            S.listItem()
                                .title("CGV")
                                .icon(FileText)
                                .child(
                                    S.document()
                                        .schemaType('cgvPage')
                                        .documentId('cgvPage')
                                        .title("Conditions Générales de Vente")
                                ),
                            S.documentTypeListItem('formula').title('Formules').icon(BookOpen),
                            S.documentTypeListItem('guide').title('Profil Guide').icon(User),
                            S.documentTypeListItem('review').title('Avis Clients').icon(MessageSquare),
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
