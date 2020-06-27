const editor = new EditorJS({
    autofocus: true,
    tools: {
        image: {
            class: SimpleImage,
            inlineToolbar: ['link']
        }
    },
    data: {
        time: 1552744582955,
        blocks: [
            {
                type: "image",
                data: {
                    url: "https://pixabay.com/get/53e2dd424b57a414f6d1867dda35367b1c3cdced5452744e_1920.jpg"
                }
            }
        ],
        version: "2.11.10"
    }
})

const saveButton = document.getElementById('save-button');
const output = document.getElementById('output');

saveButton.addEventListener('click', () => {
    editor.save().then( savedData => {
        output.innerHTML = JSON.stringify(savedData, null, 4);
    })
})