import A2jVariable from 'elements/a2j-variable/'
const a2jVar1 = {
  comment: '',
  name: 'formatteddollar',
  repeating: false,
  type: 'Number'
}
const a2jVar2 = {
  comment: '',
  name: 'sansAnswer',
  repeating: false,
  type: 'Number'
}

const answers = {
  'formatteddollar': {'name': 'formattedDollar', ' repeating': false, 'type': 'Text', 'values': [null, '123.40']},
  'sansAnswer': {'name': 'sansAnswer', ' repeating': false, 'type': ' Number', 'values': [null]}
}

// emulate stache bindings by passing state
const a2jVariableComponent1 = new A2jVariable({
  viewModel: {
    useAnswers: true,
    name: a2jVar1.name,
    varIndex: 1,
    answers
  }})
const a2jVariableComponent2 = new A2jVariable({
  viewModel: {
    useAnswers: true,
    name: a2jVar2.name,
    varIndex: 1,
    answers
  }})
const var1El = document.getElementById('var-with-answer')
const var2El = document.getElementById('var-sans-answer')
var1El.appendChild(a2jVariableComponent1.element)
var2El.appendChild(a2jVariableComponent2.element)
