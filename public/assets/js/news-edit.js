Formio.createForm(document.getElementById('addNewsEditorContainer'), {
    components: [
        {
            type: 'textfield',
            label: 'Titel',
            placeholder: 'Hier einen Titel einfügen',
            key: 'title',
            input: true,
            inputType: 'text',
            validate: {
                required:true
            }
        },
        {
            type: 'textarea',
            label: 'Inhalt',
            wysiwyg: {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                    ]
                }
            },
            key: 'content',
            input: true,
            inputType: 'text',
            validate: {
                required:true
            }
        },
        {
            type: 'button',
            action: 'submit',
            label: 'Speichern',
            theme: 'primary',
            key: 'submit',
            disableOnInvalid: true
        }
    ]
}).then(function(form) {
    form.url="http://localhost:3000/addNews/submission";
// Provide a default submission.

    // form.submission = {
    //     data: {
    //         members: [
    //             {
    //                 firstName: 'Joe',
    //                 lastName: 'Smith',
    //                 gender: 'male',
    //                 dependant: true,
    //                 birthdate: '1982-05-18'
    //             },
    //             {
    //                 firstName: 'Mary',
    //                 lastName: 'Smith',
    //                 gender: 'female',
    //                 dependant: false,
    //                 birthdate: '1979-02-17'
    //             }
    //         ]
    //     }
    // };
});


// const editor = new EditorJS({
//     autofocus: true,
//     tools: {
//         image: {
//             class: SimpleImage,
//             inlineToolbar: ['link']
//         },
//         header: {
//             class: Header,
//             config: {
//                 placeholder: 'Füge eine Überschrift hinzu'
//             }
//         },
//         attaches: AttachesTool
//     },
//     data: {
//         blocks: [
//             {
//                 type: "header",
//                 data: {
//                     text: "Hier den Titel eingeben",
//                     level: 2
//                 }
//             },
//             {
//                 type: "paragraph",
//                 data: {
//                     text: "Hier den Text eingeben"
//                 }
//             }
//         ]
//     }
//     // data: {
//     //     _id: 23745672345276856,
//     //     time: 1552744582955,
//     //     blocks: [
//     //         {
//     //             type: "image",
//     //             data: {
//     //                 url: "https://pixabay.com/get/53e2dd424b57a414f6d1867dda35367b1c3cdced5452744e_1920.jpg",
//     //                 caption: "Bild von Martina Mustermann"
//     //             },
//     //         },
//     //         {
//     //             type: "paragraph",
//     //             data: {
//     //                 text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."
//     //             },
//     //         },
//     //         {
//     //             type: "paragraph",
//     //             data: {
//     //                 text: "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus."
//     //             },
//     //         },
//     //         {
//     //             type: "paragraph",
//     //             data: {
//     //                 text: "Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi."
//     //             },
//     //         }
//     //
//     //     ],
//     //     version: "2.11.10"
//     // }
// })
//
//
// const URL = 'http://localhost:3000'
// const saveButton = document.getElementById('save-button');
// saveButton.addEventListener('click', () => {
//     editor.save().then( savedData => {
//         fetch(URL+'/addNews', {
//             headers: {
//                 'Accept': 'application/json, text/plain, *7*',
//                 'Content-Type': 'application/json'
//             },
//             method: 'POST',
//             body: JSON.stringify(savedData, null, 4)
//         })
//             .then(
//                 console.log(JSON.stringify(savedData, null, 4)),
//                 $.snackbar({content: 'Beitrag gespeichert!', style: 'toast'})
//             )
//             .catch(
//                 err => {
//                     console.error(err)
//                     $.snackbar({content: 'Fehler beim Speichern!', style: 'toast'})
//                 }
//             )
//     })
// })


