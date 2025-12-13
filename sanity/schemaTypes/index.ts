import { type SchemaTypeDefinition } from 'sanity'
import { activity } from './activity'
import { difficulty } from './difficulty'
import { category } from './category'
import { guide } from './guide'
import { event } from './event'
import { homepage } from './homepage'

export const schemaTypes: SchemaTypeDefinition[] = [
    activity,
    difficulty,
    category,
    guide,
    event,
    homepage,
]
