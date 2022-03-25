export default {
  guideId: '1261',
  templateId: '2115',
  updatedAt: '2021-12-08T17:51:00.688Z',
  active: true,
  title: 'Test template',
  header: '<p>This is a custom header. The author might use this to include court information or a caption.&nbsp;</p>\n',
  footer: '<p>This is a custom footer. The author might include this to display the fact that this form was created with the assistance of a specific legal aid organization or a court division. They might include <em>itallics</em> or <strong>bold text</strong> to make it stand out.&nbsp;</p>\n',
  rootNode: {
    tag: 'a2j-template',
    state: {},
    children: [
      { tag: 'a2j-rich-text',
        state: {
          notes: '',
          userContent: 'Hello, <a2j-variable name="Client first name TE"></a2j-variable>.'
        }
      },
      { tag: 'a2j-section-title',
        state: {
          title: 'This is a Section Title',
          titleTag: 'h2',
          underline: true
        }
      }
    ]
  }
}
