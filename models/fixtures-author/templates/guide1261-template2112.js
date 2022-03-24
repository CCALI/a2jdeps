export default {
  guideId: '1261',
  templateId: '2112',
  updatedAt: '2015-11-23T14:15:11.499Z',
  active: true,
  title: 'Authorization for Medical Treatment of a Minor',
  rootNode: {
    tag: 'a2j-template',
    state: {},
    children: [
      {
        tag: 'a2j-repeat-loop',
        state: {
          listStyleType: 'disc',
          loopTitleTag: 'h1',
          repeatEachInOneList: true,
          tableStyle: 'bordered',
          tableColumns: [
            {
              width: 50,
              variable: 'Item name TE',
              column: 'Item name'
            },
            {
              variable: 'Item value NU',
              width: 50,
              column: 'Item value'
            }
          ],
          loopCounter: 1,
          listItems: [
            {
              variable: '',
              item: 'Item 1'
            }
          ],
          loopType: 'variable',
          loopTitle: 'This is a repeat loop title',
          displayType: 'table',
          loopRichText: '',
          loopVariable: 'CountVar'
        }
      },
      {
        tag: 'a2j-rich-text',
        state: {
          notes: '',
          userContent: 'User\'s last name <a2j-variable name=Client last name TE />.'
        }
      },
      {
        tag: 'a2j-rich-text',
        state: {
          notes: '',
          userContent: `<p><em>Lorem ipsum dolor sit amet, pri ad porro consul
            disputando. Mea tale admodum cu, soluta fuisset per ad. Te omittam
            noluisse consequat vel. Impetus appetere antiopam sit ut, at nec
            inani forensibus necessitatibus. Eu eum appetere facilisis reprimique,
            an sit ignota fierent invenire, duis denique sea an. Sit ceteros
            dolores inimicus ut, nec id tantas delenit phaedrum. Nullam prompta
            sit ne.</em></p>`
        }
      }
    ]
  }
}
