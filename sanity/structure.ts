import { type StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
    S.list()
        .title('Contenu')
        .items([
            S.listItem()
                .title("Page d'accueil")
                .child(
                    S.document()
                        .schemaType('homepage')
                        .documentId('homepage')
                ),
            S.divider(),
            ...S.documentTypeListItems().filter(
                (listItem) => !['homepage'].includes(listItem.getId() as string)
            ),
        ])
