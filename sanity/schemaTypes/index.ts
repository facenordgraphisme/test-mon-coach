import { type SchemaTypeDefinition } from 'sanity'
import { activity } from './activity'
import { difficulty } from './difficulty'
import { category } from './category'
import { guide } from './guide'
import { bike } from './bike'
import { event } from './event'
import { homepage } from './homepage'
import { booking } from './booking'
import { formula } from './formula'
import { levelsPage } from './levelsPage'
import { review } from './review'
import { accessPage } from './accessPage'
import { legalPage } from './legalPage'
import { cgvPage } from './cgvPage'
import { blockContent } from './blockContent'
// adventuresPage, // Decommissioned
import { contactPage } from './contactPage'
import { reviewsPage } from './reviewsPage'
import { calendarPage } from './calendarPage'
import { seo } from './seo'
import { monoActivitePage } from './monoActivitePage'
import { duoActivitesPage } from './duoActivitesPage'
import { surMesurePage } from './surMesurePage'

import { siteSettings } from './siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
    activity,
    difficulty,
    category,
    guide,
    event,
    homepage,
    booking,
    formula,
    levelsPage,
    review,
    accessPage,
    legalPage,
    cgvPage,
    bike,
    blockContent,
    // adventuresPage, // Decommissioned
    contactPage,
    reviewsPage,
    calendarPage,
    seo,
    monoActivitePage,
    duoActivitesPage,
    surMesurePage,
    siteSettings
]
