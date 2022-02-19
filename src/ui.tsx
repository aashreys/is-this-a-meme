import {
  Button,
  Columns,
  Container,
  render,
  Text,
  TextboxNumeric,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { ImgFlip } from './meme_providers/imgflip'

import { CloseHandler, CreateRectanglesHandler } from './types'

function Plugin() {
  const [count, setCount] = useState<number | null>(5)
  const [countString, setCountString] = useState('5')
  const handleCreateRectanglesButtonClick = useCallback(
    function () {
      const imgflip = new ImgFlip();
      imgflip.searchMeme('is this a')
      .then((memes) => console.log(memes))

      imgflip.getPopularMemes()
      .then((memes) => console.log(memes))

      // if (count !== null) {
      //   emit<CreateRectanglesHandler>('CREATE_RECTANGLES', count)
      // }
      // var request = new XMLHttpRequest()
      // // This link has random lorem ipsum text
      // request.open('GET', 'https://cors-anywhere.herokuapp.com/https://imgflip.com/search?q=is+this+a+')
      // request.responseType = 'text'
      // request.onload = () => {
      //   console.log(request.response)
      //   // window.parent.postMessage({pluginMessage: request.response}, '*')
      // };
      // request.send()
    },
    [count]
  )
  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>('CLOSE')
  }, [])
  return (
    <Container>
      <VerticalSpace space="large" />
      <Text muted>Count</Text>
      <VerticalSpace space="small" />
      <TextboxNumeric
        onNumericValueInput={setCount}
        onValueInput={setCountString}
        value={countString}
      />
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleCreateRectanglesButtonClick}>
          Search
        </Button>
        <Button fullWidth onClick={handleCloseButtonClick} secondary>
          Close
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
