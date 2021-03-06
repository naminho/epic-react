import React, { useState } from 'react'
import { create, act } from 'react-test-renderer'
import { when, not, random } from '../index'

const first = () => <p>first</p>
const firstElement = create(<p>first</p>).toJSON()
const second = () => <p>second</p>
const secondElement = create(<p>second</p>).toJSON()

test('when: renders the markup if condition is truthy.', () => {
  let markup = create(when(true, first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(when('hello', first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when('true', first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(when(1, first)).toJSON()
  expect(markup).toEqual(firstElement)
})

test('when: renders nothing if condition is falsy.', () => {
  let markup = create(when(false, first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when('hello', first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when('', first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when(0, first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when('false', first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when(0, first)).toJSON()
  expect(markup).toEqual(null)
})

test('when: renders otherwise if condition is falsy.', () => {
  let markup = create(when(false, first, second)).toJSON()
  expect(markup).toEqual(secondElement)
  markup = create(when('hello', first, second)).toJSON()
  expect(markup).toEqual(secondElement)
  markup = create(when('false', first, second)).toJSON()
  expect(markup).toEqual(secondElement)
  markup = create(when(0, first, second)).toJSON()
  expect(markup).toEqual(secondElement)
})

test('when: component is only initialized once.', () => {
  let setCondition

  let firstRenders = 0
  const FirstComponent = () => {
    firstRenders += 1
    return <p>first</p>
  }

  let secondRenders = 0
  const SecondComponent = () => {
    secondRenders += 1
    return <p>first</p>
  }

  let wrapperRenders = 0
  const Wrapper = () => {
    let condition
    ;[condition, setCondition] = useState(true)
    wrapperRenders += 1
    return when(condition, FirstComponent, SecondComponent)
  }

  create(<Wrapper />).toJSON()
  expect(wrapperRenders).toEqual(1)
  expect(firstRenders).toEqual(1)
  expect(secondRenders).toEqual(0)

  act(() => {
    setCondition(false)
  })

  expect(wrapperRenders).toEqual(2)
  expect(firstRenders).toEqual(1)
  expect(secondRenders).toEqual(1)

  act(() => {
    setCondition(true)
  })

  expect(wrapperRenders).toEqual(3)
  expect(firstRenders).toEqual(2)
  expect(secondRenders).toEqual(1)

  act(() => {
    setCondition(true)
  })

  expect(wrapperRenders).toEqual(4)
  expect(firstRenders).toEqual(2)
  expect(secondRenders).toEqual(1)
})

test('not: renders only if condition is falsy.', () => {
  let markup = create(not(true, first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(not(false, first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(not('false', first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(not(-1, first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(not(1, first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(not('true', first)).toJSON()
  expect(markup).toEqual(null)
})

test('random: randomly picks component from list.', () => {
  const component = () => <p>first</p>
  let tree = create(random(component, component, component, component)).toJSON()
  expect(tree).toEqual(firstElement)
  tree = create(random(component)).toJSON()
  expect(tree).toEqual(firstElement)
})
