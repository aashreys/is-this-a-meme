import {
  Container,
  render,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { Component, h, JSX } from 'preact'
import { SearchContainer } from './ ui/search_container'
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
    this.onSearchTrigger = this.onSearchTrigger.bind(this)
    this.onSearchClear = this.onSearchClear.bind(this)
    this.setMemes = this.setMemes.bind(this)
    this.setUIState = this.setUIState.bind(this)
    this.onMemeLoadError = this.onMemeLoadError.bind(this)
    this.getInternetStatus = this.getInternetStatus.bind(this)
  }

  getInternetStatus(): boolean {
    return window.navigator.onLine
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

  onSearchTrigger(query: string) {
    this.searchForMemes(query)
  }

  onSearchClear() {
    if (this.popularMemes.length > 0) {
      this.setMemes(this.popularMemes)
    } else {
      this.fetchPopularMemes()
    }
    
  }

  onMemeLoadError(meme: Meme) {
    this.setMemes(this.state.memes.filter((element: Meme) => {return element !== meme}))
  }

  render(props: any, state: any) {
    return (
      <Container>
        <SearchContainer
          onSearchTrigger={this.onSearchTrigger}
          onSearchClear={this.onSearchClear}
        />
        <div class={styles.contentContainer} >
          <UIContainer
            uiState={state.uiState} 
            memes={state.memes} 
            onMemeLoadError={this.onMemeLoadError}
          />
        </div>
      </Container>
    )
  }
  
}

function Plugin(props: any) {

  return ( <UI /> )

}

export default render(Plugin)