module.export = [
    {
        "id": "cle8vuxqt0001356uq75c6k8w",
        "tag": "a2j-rich-text",
        "state": {
            "notes": "",
            "userContent": "This is text everyone will see.&nbsp;"
        },
        "children": []
    },
    {
        "id": "cle8vv5cx0002356u11f1q7jw",
        "tag": "a2j-conditional",
        "state": {
            "operator": "is-true",
            "elseClause": true,
            "leftOperand": "TF 1 TF",
            "rightOperand": "",
            "leftOperandType": "variable",
            "rightOperandType": "text"
        },
        "children": [
            {
                "guideId": "",
                "templateId": "",
                "title": "Untitled Template",
                "active": true,
                "rootNode": {
                    "id": "cle8vv5d30003356uqg0twoak",
                    "tag": "a2j-template",
                    "state": {},
                    "children": [
                        {
                            "id": "cle8vvjee0007356u32yv1qtu",
                            "tag": "a2j-rich-text",
                            "state": {
                                "notes": "",
                                "userContent": "TF 1 Var is true. Cool"
                            },
                            "children": []
                        }
                    ]
                },
                "header": "",
                "hideHeaderOnFirstPage": false,
                "footer": "",
                "hideFooterOnFirstPage": false
            },
            {
                "guideId": "",
                "templateId": "",
                "title": "Untitled Template",
                "active": true,
                "rootNode": {
                    "id": "cle8vv5d30004356uhgffuzz5",
                    "tag": "a2j-template",
                    "state": {},
                    "children": [
                        {
                            "id": "cle8vw4pq0008356uq8r2ttyp",
                            "tag": "a2j-rich-text",
                            "state": {
                                "notes": "",
                                "userContent": "TF 1 Var is false. Cool cool"
                            },
                            "children": []
                        }
                    ]
                },
                "header": "",
                "hideHeaderOnFirstPage": false,
                "footer": "",
                "hideFooterOnFirstPage": false
            },
            {
                "id": "cle8vv5d30005356u42386lq3",
                "tag": "conditional-add-element",
                "state": {},
                "children": []
            },
            {
                "id": "cle8vv5d30006356ug7pgzylm",
                "tag": "conditional-add-element",
                "state": {},
                "children": []
            }
        ]
    },
    {
        "id": "cle8vwi8w0009356uwrl0c5lq",
        "tag": "a2j-conditional",
        "state": {
            "operator": "is-true",
            "elseClause": false,
            "leftOperand": "TF 2 TF",
            "rightOperand": "",
            "leftOperandType": "variable",
            "rightOperandType": "variable"
        },
        "children": [
            {
                "guideId": "",
                "templateId": "",
                "title": "Untitled Template",
                "active": true,
                "rootNode": {
                    "id": "cle8vwi93000a356uepdhwwb9",
                    "tag": "a2j-template",
                    "state": {},
                    "children": [
                        {
                            "id": "cle8vwoi9000e356uz0lcfbk5",
                            "tag": "a2j-rich-text",
                            "state": {
                                "notes": "",
                                "userContent": "TF 2 is true.&nbsp;"
                            },
                            "children": []
                        }
                    ]
                },
                "header": "",
                "hideHeaderOnFirstPage": false,
                "footer": "",
                "hideFooterOnFirstPage": false
            },
            {
                "guideId": "",
                "templateId": "",
                "title": "Untitled Template",
                "active": true,
                "rootNode": {
                    "id": "cle8vwi93000b356uxuembg8h",
                    "tag": "a2j-template",
                    "state": {},
                    "children": []
                },
                "header": "",
                "hideHeaderOnFirstPage": false,
                "footer": "",
                "hideFooterOnFirstPage": false
            },
            {
                "id": "cle8vwi94000c356uqmrve6ua",
                "tag": "conditional-add-element",
                "state": {},
                "children": []
            },
            {
                "id": "cle8vwi94000d356ufi9r9b62",
                "tag": "conditional-add-element",
                "state": {},
                "children": []
            }
        ]
    }
]