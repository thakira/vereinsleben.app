const editor = new EditorJS({
    /**
     * Tools list
     */
    tools: {
        header: Header,
        image: SimpleImage,
        list: List,
        checklist: Checklist,
        quote: Quote,
        warning: Warning,
        marker: Marker,
        code: CodeTool,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        linkTool: LinkTool,
        embed: Embed,
        table: Table
    },

    /**
     * Internationalzation config
     */
    i18n: {
        /**
         * @type {I18nDictionary}
         */
        messages: {
            /**
             * Other below: translation of different UI components of the editor.js core
             */
            ui: {
                "blockTunes": {
                    "toggler": {
                        "Click to tune": "Нажмите, чтобы настроить",
                        "or drag to move": "или перетащите"
                    },
                },
                "inlineToolbar": {
                    "converter": {
                        "Convert to": "Konvertieren in"
                    }
                },
                "toolbar": {
                    "toolbox": {
                        "Add": "Hinzufügen"
                    }
                }
            },

            /**
             * Section for translation Tool Names: both block and inline tools
             */
            toolNames: {
                "Text": "Text",
                "Heading": "Überschrift",
                "List": "Liste",
                "Warning": "Warnung",
                "Checklist": "Checkliste",
                "Quote": "Zitat",
                "Code": "Code",
                "Delimiter": "Begrenzer",
                "Raw HTML": "reines HTML",
                "Table": "Tabelle",
                "Link": "Link",
                "Marker": "Marker",
                "Bold": "Fett",
                "Italic": "Kursiv",
                "InlineCode": "Inline Code",
            },

            /**
             * Section for passing translations to the external tools classes
             */
            tools: {
                /**
                 * Each subsection is the i18n dictionary that will be passed to the corresponded plugin
                 * The name of a plugin should be equal the name you specify in the 'tool' section for that plugin
                 */
                "warning": { // <-- 'Warning' tool will accept this dictionary section
                    "Title": "Titel",
                    "Message": "Nachricht",
                },

                /**
                 * Link is the internal Inline Tool
                 */
                "link": {
                    "Add a link": "Link hinzufügen"
                },
                /**
                 * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
                 */
                "stub": {
                    'The block can not be displayed correctly.': 'Der Block kann nicht korrekt dargestellt werden'
                }
            },

            /**
             * Section allows to translate Block Tunes
             */
            blockTunes: {
                /**
                 * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
                 * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
                 *
                 * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
                 */
                "delete": {
                    "Delete": "Löschen"
                },
                "moveUp": {
                    "Move up": "nach oben schieben"
                },
                "moveDown": {
                    "Move down": "nach unten schieben"
                }
            },
        }
    },
});