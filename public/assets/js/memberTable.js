$(document).ready( function () {
    const URL = "http://127.0.0.1:3000";
    const editor = new $.fn.dataTable.Editor({
        table: '#userTable',
        idSrc:  '_id',
        ajax: {
            edit: {
                type: 'POST',
                url: URL + '/editMember',
            },
            remove: {
                type: 'DELETE',
                url: URL + '/deleteMember',
            },
        },

        i18n: {
            edit: {
                button: "Bearbeiten",
                title: "Eintrag bearbeiten",
                submit: "Speichern",
            },
            remove: {
                button: "Löschen",
                title: "Eintrag löschen",
                submit: "Löschen",
                confirm: {
                    _: "Bist Du sicher, dass Du dieses Mitglied löschen möchtest?",
                    1: "Bist Du sicher, dass Du dieses Mitglied löschen möchtest?",
                },
            },
        },
        fields: [
            {label : 'ID', name: '_id'},
            {label: 'Vorname', name: 'firstname'},
            {label: 'Nachname', name: 'lastname'},
            {label: 'Mobil', name: 'mobile'},
            {label: 'Telefon', name: 'phone'},
            {label: 'E-Mail', name: 'email'},
            {
                label: 'Geburtstag',
                name: 'birthday',
                type: 'datetime',


            },
            {label: 'Mitglieds-Nr.', name: 'memberNumber'},
            {
                label: 'Rechte',
                name: 'role',
                type: "select",
                options: [
                    {label: "User", value: "user"},
                    {label: "Trainer", value: "trainer"},
                    {label: "Admin", value: "admin"},
                ],
            },
        ],
    });
    $('#userTable').DataTable({
        ajax: {
            'type': 'GET',
            'url': URL + '/getMemberData',
        },
        language: {
            url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json",
            select: {
                rows: {
                    _: "%d Zeilen ausgewählt",
                    1: "Eine Zeile ausgewählt",
                },
            },
        },
        responsive: {
            details: true
        },
        select: true,
        dom: 'Bfrtip',
        buttons: [
            { extend: 'edit',   editor: editor },
            { extend: 'remove', editor: editor },
        ],
        columns:
            [
                {data: 'firstname', 'name': 'Vorname'},
                {data: 'lastname', 'name': 'Nachname'},
                {data: 'mobile', "defaultContent": "", 'name': 'Mobil'},
                {data: 'phone', "defaultContent": "", 'name': 'Telefon'},
                {data: 'email', "defaultContent": "", 'name': 'E-Mail'},
                {
                    data: 'birthday',
                    type: 'datetime',
                    render: function (data, type, row) { return data ? moment(data).format('DD.MM.YYYY') : ''; }
                },
                {data: null ,render: function(data, type, row) {
                        if (data.workhours == null) {
                            return "0"
                        } else {
                            return data.worked + '/' + data.workhours;
                        }
                    }},
                {data: 'memberNumber', "defaultContent": "xxx", 'name': 'Mitglieds-Nr.'},
                {data: 'role', 'name': 'Rechte'},
                {
                    data: 'createdAt',
                    type: 'datetime',
                    render: function (data, type, row) { return data ? moment(data).format('DD.MM.YYYY') : ''; }
                },
            ],
    })

});