
const editor = new EditorJS({
    autofocus: true,
    tools: {
        image: {
            class: SimpleImage,
            inlineToolbar: ['link']
        },
        header: Header,
        attaches: AttachesTool
    },
    data: ''
    // data: {
    //     _id: 23745672345276856,
    //     time: 1552744582955,
    //     blocks: [
    //         {
    //             type: "image",
    //             data: {
    //                 url: "https://pixabay.com/get/53e2dd424b57a414f6d1867dda35367b1c3cdced5452744e_1920.jpg",
    //                 caption: "Bild von Martina Mustermann"
    //             },
    //         },
    //         {
    //             type: "paragraph",
    //             data: {
    //                 text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."
    //             },
    //         },
    //         {
    //             type: "paragraph",
    //             data: {
    //                 text: "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus."
    //             },
    //         },
    //         {
    //             type: "paragraph",
    //             data: {
    //                 text: "Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi."
    //             },
    //         }
    //
    //     ],
    //     version: "2.11.10"
    // }
})

const saveButton = document.getElementById('save-button');
const output = document.getElementById('output');

const URL = 'http://localhost:3000'

saveButton.addEventListener('click', () => {
    editor.save().then( savedData => {
        console.log("JSON: " + JSON.stringify(savedData, null, 4));
        output.innerHTML = JSON.stringify(savedData, null, 4);

        // POST
        fetch(URL+'/addNews', {
                method: 'POST',
                body: JSON.stringify(savedData),
                headers: {
                    'content': 'application/json; charset=UTF-8'
                }
            })
                         .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
    })
})