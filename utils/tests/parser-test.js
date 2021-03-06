import { assert } from 'chai'
import Parser from '~/utils/parser'
import partialJSON from '~/models/fixtures/partial.json'
import partialXML from '~/models/fixtures/partial.anx!text' // eslint-disable-line
import interviewJSON from '~/models/fixtures/interview.json'
import answersJSON from '~/models/fixtures/inclusive_answers.json'
import answersXML from '~/models/fixtures/inclusive_answers.xml!text' // eslint-disable-line

// These correspond to an interview that has repeating variables
import answersWithRepeating from './fixtures/answers-with-repeating-values.json'
import pagesWithRepeating from './fixtures/interview-pages-with-repeating-vars.json'
import answersXMLWithRepeating from './fixtures/answers-file-with-repeating-values.anx!text' // eslint-disable-line

// Nested loop answers file
import nestedAnswersXML from './fixtures/answers-with-nested-values.anx!text' // eslint-disable-line

import 'steal-mocha'

describe('Parser', function () {
  it('generates answers file correctly with repeating values', function () {
    const pages = pagesWithRepeating
    const answers = answersWithRepeating
    const expectedXML = answersXMLWithRepeating

    const parsedXML = Parser.parseANX(answers, pages)
    assert.equal(parsedXML, expectedXML.trim(), 'generated xml is wrong')
  })

  it('generates hot docs answers file correctly', function () {
    let variables = answersJSON
    let expectedXML = answersXML
    let pages = interviewJSON.pages

    let parsedXML = Parser.parseANX(variables, pages)
    assert.equal(parsedXML, expectedXML.trim(), 'generated xml is wrong')
  })

  it('parses hot docs answers file correctly', function () {
    let answersXML = partialXML
    let expectedAnswers = partialJSON
    let parsedAnswers = Parser.parseJSON(answersXML)

    assert.deepEqual(parsedAnswers, expectedAnswers, 'generated answers are wrong')
  })

  it('parsed answer file sets TF values to boolean', function () {
    let answersXML = partialXML
    let parsedAnswers = Parser.parseJSON(answersXML)

    assert.equal(parsedAnswers['like chocolate tf'].values[1], true, 'TF answer not of type boolean')
  })

  it('parsed answer file captures nested loop answers at correct indexes', function () {
    let parsedAnswers = Parser.parseJSON(nestedAnswersXML)
    assert.equal(parsedAnswers['user gender'].values[21], 'Female', 'MC values')
    assert.equal(parsedAnswers['salary nu'].values[21], 67890, 'Number values')
    assert.equal(parsedAnswers['client last name te'].values[21], 'Dang', 'Text values')
    assert.equal(parsedAnswers['dob da'].values[21], '02/02/1980', 'Date values')
    assert.equal(parsedAnswers['chocolate tf'].values[21], true, 'TF values')
  })
})
