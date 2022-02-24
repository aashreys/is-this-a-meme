import {
  Container,
  IconSearch32,
  render,
  Textbox,
  useWindowResize
} from '@create-figma-plugin/ui'
import { useState } from 'preact/hooks'
import { emit } from '@create-figma-plugin/utilities'
import { Component, h, JSX } from 'preact'
import styles from './ ui/styles.css'
import { UIContainer, UIState } from './ ui/ui_container'
import { ImgFlip } from './meme_providers/imgflip'
import { Meme } from './models/models'
import { ResizeWindowHandler } from './types'

class UI extends Component<any, any> {

  imgflip = new ImgFlip()
  popularMemes: Meme[] = []

  constructor(props: any) {
    super(props)
    this.state = {
      uiState: UIState.Memes,
      query: '',
      memes: []
    }
    this.bindMethods()
    this.fetchPopularMemes()
  }

  bindMethods() {
    this.fetchPopularMemes = this.fetchPopularMemes.bind(this)
    this.searchForMemes = this.searchForMemes.bind(this)
    this.onSearchKeyDown = this.onSearchKeyDown.bind(this)
    this.onSearchInput = this.onSearchInput.bind(this)
    this.onSearchClear = this.onSearchClear.bind(this)
    this.setMemes = this.setMemes.bind(this)
    this.setUIState = this.setUIState.bind(this)
  }

  fetchPopularMemes() {
    this.imgflip.getPopularMemes()
    .then((memes) => {
      this.popularMemes = memes
      this.setMemes(this.popularMemes)
    })
  }

  searchForMemes(query: string) {
    this.setUIState(UIState.Loading)
    this.imgflip.searchMeme(query)
    .then((memes) => {
      window.scrollTo(0, 0)
      if (memes.length > 0) this.setMemes(memes)
      else this.setUIState(UIState.NoMemesFound)
    })
  }

  onSearchKeyDown(input: any) {    
    if (input.key === 'Enter') {
      if (this.state.query.length > 0) {
        console.log('searching for: ' + this.state.query)
        this.searchForMemes(this.state.query)
      } 
      else {
        console.log('cleared search, displaying popular memes')
        this.setMemes(this.popularMemes)
      }
    }
  }

  onSearchInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    this.setState(prevState => ({
      ...prevState,
      query: event.currentTarget.value
    }))
  }

  onSearchClear() {
    this.setMemes(this.popularMemes)
  }

  setMemes(memes: Meme[]) {
    this.setState(prevState => ({
      ...prevState,
      uiState: UIState.Memes,
      memes: memes
    }))
  }

  setUIState(uiState: UIState) {
    this.setState(prevState => ({
      ...prevState,
      uiState: uiState
    }))
  }

  render(props: any, state: any) {
    return (
      <Container>
        <div class={styles.searchContainer} >
          <Textbox 
            icon={<IconSearch32 />} 
            placeholder="Search memes..." 
            value={state.query}
            onInput={this.onSearchInput}
            onKeyDownCapture={this.onSearchKeyDown} 
          />
        </div>
        <div class={styles.contentContainer} >
          <UIContainer uiState={UIState.Memes} memes={state.memes} />
        </div>
      </Container>
    )
  }
  
}

function Plugin(props: any) {

  function onWindowResize (windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>('RESIZE_WINDOW', windowSize)
  }

  useWindowResize(onWindowResize, {
    minWidth: 240,
    minHeight: 300,
    maxWidth: 640,
    maxHeight: 800,
    resizeBehaviorOnDoubleClick: 'minimize'
  })

  return ( <UI /> )

}

export default render(Plugin)

