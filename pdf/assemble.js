/*
  SYNTAX WARNING
  ===
  This file is written in CommonJS because it is also used on the server for
    the unified test assembly.
  This file is also written in ES5 syntax because Steal cannot parse ES6+
    syntax unless the file utilitizes import/export.
  This file cannnot use import/export because Node (V <= 8) currently does
    not support ESM import/export.
*/

(function () {
  'use strict'
  function areaComparator (areaA, areaB) {
    return areaA.top - areaB.top || areaA.left - areaB.left
  }

  function boxComparator (a, b) {
    return a.page - b.page || areaComparator(a.area, b.area)
  }

  function getBoxPdfArea (pages) {
    return function _getBoxPdfArea (box) {
      const page = pages[box.page]
      const pdfSize = page.pdfSize
      const domSize = page.domSize
      const scaleX = pdfSize.width / domSize.width
      const scaleY = pdfSize.height / domSize.height
      const area = box.area
      return {
        top: scaleY * area.top,
        left: scaleX * area.left,
        width: scaleX * area.width,
        height: scaleY * area.height
      }
    }
  }

  function getTemplateOverlayData (template) {
    const rootNode = template.rootNode
    const pages = rootNode.pages
    const boxes = rootNode.boxes
    const documentOptions = rootNode.documentOptions
    return {
      pages,
      boxes,
      documentOptions
    }
  }

  function readInteger (value, defaultValue) {
    if (typeof value !== 'number') {
      value = parseInt(value, 10)
    }
    if (isNaN(value)) {
      return defaultValue
    }
    return value
  }

  function getDocumentGlobals (pages, documentOptions) {
    const margins = documentOptions.addendumOptions.margins || {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
    const lastPageSize = pages[pages.length - 1].pdfSize
    const pageSize = documentOptions.addendumOptions.pageSize || lastPageSize
    return {
      addendum: {
        margins,
        pageSize,
        labelStyle: {
          fontSize: documentOptions.fontSize - 2,
          fontName: documentOptions.fontName,
          textAlign: 'left',
          textColor: '000000'
        }
      }
    }
  }

  function getOverlay (templateData) {
    const boxes = templateData.boxes
    const pages = templateData.pages
    const answers = templateData.answers
    const variables = templateData.variables
    const customDocumentOptions = templateData.documentOptions

    const documentOptions = Object.assign({ fontName: 'Lato' }, customDocumentOptions, { fontSize: readInteger(customDocumentOptions.fontSize, 12) })
    const documentGlobals = getDocumentGlobals(pages, documentOptions)

    const defaultTextOptions = {
      fontSize: documentOptions.fontSize,
      fontName: documentOptions.fontName,
      textAlign: 'left',
      textColor: '000000'
    }

    const variableBoxesMap = boxes.filter(function (box) {
      return !!box.variable
    }).reduce(function (map, box) {
      const key = box.groupId || box.id
      map[key] = map[key] || []
      map[key].push(box)

      return map
    }, {})

    const getBoxArea = getBoxPdfArea(pages)
    const patches = Object.keys(variableBoxesMap).reduce(function (patches, boxKey) {
      const variableKey = variableBoxesMap[boxKey][0].variable.toLowerCase()
      const variable = variables[variableKey]
      const answer = answers[variableKey]
      const answerValue = answer && answer.values[1]
      const hasAnswerValue = answerValue !== null &&
                          answerValue !== undefined &&
                          answerValue !== ''
      const hasVariableToPatch = variable && answer && hasAnswerValue
      if (!hasVariableToPatch) {
        return patches
      }

      const boxes = variableBoxesMap[boxKey]
      const defaultVariableOptions = {
        overflowStyle: 'clip-overflow',
        addendumLabel: variable.name,
        checkIcon: 'normal-check',
        isCheck: false
      }
      const customVariableOptions = documentOptions.variableOptions[variableKey] || {}
      const variableOptions = Object.assign({}, defaultVariableOptions, customVariableOptions)
      const patcher = getPatcher(variable.type)
      const newPatches = patcher({
        boxes,
        getBoxArea,
        answer,
        answerValue,
        variable,
        variableOptions,
        documentOptions,
        defaultTextOptions
      })

      return [].concat(patches, newPatches)
    }, [])

    return Object.assign({}, documentGlobals, { patches })
  }

  function getTextPatches (options) {
    const boxes = options.boxes
    const getBoxArea = options.getBoxArea
    const variable = options.variable
    const answer = options.answer
    const answerValue = options.answerValue
    const variableOptions = options.variableOptions
    const defaultTextOptions = options.defaultTextOptions

    const style = variableOptions.overflowStyle
    const addendumLabel = variableOptions.addendumLabel

    const isTableColumn = variable.repeating
    if (isTableColumn) {
      const values = answer.values.slice(1)
      const columnBoxes = boxes.sort(boxComparator).slice(0, values.length)
      const column = columnBoxes.map(function (box, index) {
        return {
          type: 'text',
          page: box.page,
          content: values[index],
          area: getBoxArea(box),
          text: defaultTextOptions
        }
      })
      const tablePatch = {
        type: 'table-text',
        columns: [column],
        addendumLabel,
        addendumColumns: []
      }
      return [tablePatch]
    }

    // mutli-line patch required for addendum overflow on single-text
    const isSingleLine = boxes.length === 1 && (!style || style === 'clip-overflow')
    if (isSingleLine) {
      const box = boxes[0]
      const textPatch = {
        type: 'text',
        page: box.page,
        content: answerValue,
        area: getBoxArea(box),
        text: defaultTextOptions
      }
      return [textPatch]
    }

    const multilinePatch = {
      type: 'multiline-text',
      content: answerValue,
      overflow: {
        style,
        addendumLabel
      },
      addendumText: defaultTextOptions,
      lines: boxes.sort(boxComparator).map(function (box) {
        return {
          page: box.page,
          area: getBoxArea(box),
          text: defaultTextOptions
        }
      })
    }
    return [multilinePatch]
  }

  function getTrueFalsePatches (options) {
    const boxes = options.boxes
    const getBoxArea = options.getBoxArea
    const answerValue = options.answerValue
    const variableOptions = options.variableOptions

    return boxes
      .filter(function (box) {
        const shouldInclude = box.isInverted ? !answerValue : answerValue
        return shouldInclude
      })
      .map(function (box) {
        return {
          type: 'checkmark',
          page: box.page,
          icon: variableOptions.checkIcon,
          area: getBoxArea(box)
        }
      })
  }

  function getMultipleChoicePatches (options) {
    const boxes = options.boxes
    const getBoxArea = options.getBoxArea
    const answerValue = options.answerValue
    const variableOptions = options.variableOptions
    const defaultTextOptions = options.defaultTextOptions
    return boxes
      .filter(function (box) {
        const shouldMatch = variableOptions.isCheck
        if (!shouldMatch) {
          return true
        }
        const isMatch = box.variableValue === answerValue
        const shouldInclude = box.isInverted ? !isMatch : isMatch
        return shouldInclude
      })
      .map(function (box) {
        if (variableOptions.isCheck) {
          return {
            type: 'checkmark',
            page: box.page,
            icon: variableOptions.checkIcon,
            area: getBoxArea(box)
          }
        }

        return {
          type: 'text',
          page: box.page,
          content: answerValue,
          area: getBoxArea(box),
          text: defaultTextOptions
        }
      })
  }

  function getDatePatches (options) {
    const boxes = options.boxes
    const answer = options.answer
    const getBoxArea = options.getBoxArea
    const answerValue = options.answerValue
    const defaultTextOptions = options.defaultTextOptions
    const variable = options.variable
    const variableOptions = options.variableOptions
    const addendumLabel = variableOptions.addendumLabel

    const isTableColumn = variable.repeating
    if (isTableColumn) {
      const values = answer.values.slice(1)
      const columnBoxes = boxes.sort(boxComparator).slice(0, values.length)
      const column = columnBoxes.map(function (box, index) {
        return {
          type: 'text',
          page: box.page,
          content: '' + values[index],
          area: getBoxArea(box),
          text: defaultTextOptions
        }
      })
      const tablePatch = {
        type: 'table-text',
        columns: [column],
        addendumLabel,
        addendumColumns: []
      }
      return [tablePatch]
    }

    return boxes.map(function (box) {
      return {
        type: 'text',
        page: box.page,
        content: '' + answerValue,
        area: getBoxArea(box),
        text: defaultTextOptions
      }
    })
  }

  function getNumberPatches (options) {
    const boxes = options.boxes
    const getBoxArea = options.getBoxArea
    const answer = options.answer
    const answerValue = options.answerValue
    const defaultTextOptions = options.defaultTextOptions
    const variable = options.variable
    const variableOptions = options.variableOptions
    const addendumLabel = variableOptions.addendumLabel

    const isTableColumn = variable.repeating
    if (isTableColumn) {
      const values = answer.values.slice(1)
      const columnBoxes = boxes.sort(boxComparator).slice(0, values.length)
      const column = columnBoxes.map(function (box, index) {
        return {
          type: 'text',
          page: box.page,
          content: '' + values[index],
          area: getBoxArea(box),
          text: defaultTextOptions
        }
      })
      const tablePatch = {
        type: 'table-text',
        columns: [column],
        addendumLabel,
        addendumColumns: []
      }
      return [tablePatch]
    }

    return boxes.map(function (box) {
      return {
        type: 'text',
        page: box.page,
        content: '' + answerValue,
        area: getBoxArea(box),
        text: defaultTextOptions
      }
    })
  }

  const patcherTypeMap = {
    text: getTextPatches,
    date: getDatePatches,
    number: getNumberPatches,
    mc: getMultipleChoicePatches,
    tf: getTrueFalsePatches
  }

  function getPatcher (variableType) {
    const type = variableType.toLowerCase()
    return patcherTypeMap[type]
  }

  function getTemplateOverlay (template, variables, answers) {
    return getOverlay(Object.assign(getTemplateOverlayData(template), {
      variables,
      answers
    }))
  }

  module.exports = {
    areaComparator,
    boxComparator,
    readInteger,
    getTemplateOverlay,
    testing: {
      getOverlay,
      getPatcher,
      getTextPatches,
      getDatePatches,
      getNumberPatches,
      getTrueFalsePatches,
      getMultipleChoicePatches,

      getBoxPdfArea,
      getDocumentGlobals,
      getTemplateOverlayData
    }
  }
})()
