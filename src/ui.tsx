import {
  Container,
  render,
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { Component, h } from 'preact'
import { SearchContainer } from './ ui/search_container'
import styles from './ ui/styles.css'
import { UIContainer, UIState } from './ ui/ui_container'
import { EVENT_REQUEST_RECENTS, EVENT_NEW_RECENTS } from './main'
import { ImgFlip } from './meme_providers/imgflip'
import { Meme } from './models/models'

class UI extends Component<any, any> {

  imgflip = new ImgFlip()

  constructor(props: any) {
    super(props)
    this.state = {
      uiState: UIState.Home,
      query: '',
      recentMemes: [],
      popularMemes: [],
      searchResultMemes: []
    }
    this.bindMethods()
    this.loadRecentMemes()
    this.fetchPopularMemes()
  }

  bindMethods() {
    this.getInternetStatus = this.getInternetStatus.bind(this)
    this.loadRecentMemes = this.loadRecentMemes.bind(this)
    this.fetchPopularMemes = this.fetchPopularMemes.bind(this)
    this.setPopularMemes = this.setPopularMemes.bind(this)
    this.onRecentMemesReceived = this.onRecentMemesReceived.bind(this)
    this.setRecentMemes = this.setRecentMemes.bind(this)
    this.searchForMemes = this.searchForMemes.bind(this)
    this.setSearchResultMemes = this.setSearchResultMemes.bind(this)
    this.setUIState = this.setUIState.bind(this)
    this.onSearchTrigger = this.onSearchTrigger.bind(this)
    this.onSearchClear = this.onSearchClear.bind(this)
    this.onMemeLoadError = this.onMemeLoadError.bind(this)
  }

  getInternetStatus(): boolean {
    return window.navigator.onLine
  }

  loadRecentMemes() {
    emit(EVENT_REQUEST_RECENTS)
    on(EVENT_NEW_RECENTS, this.onRecentMemesReceived)
  }

  fetchPopularMemes() {
    this.imgflip.getPopularMemes()
    .then((memes) => {
      this.setPopularMemes(memes)
    })
  }

  setPopularMemes(memes: Meme[]) {
    this.setState(prevState => ({
      ...prevState,
      popularMemes: memes
    }))
  }

  onRecentMemesReceived(memes: Meme[]) {
    if (memes !== undefined) {
      this.setRecentMemes(memes)
    }
  }

  setRecentMemes(memes: Meme[]) {
    this.setState(prevState => ({
      ...prevState,
      recentMemes: memes
    }))
  }

  searchForMemes(query: string) {
    this.setUIState(UIState.Loading)
    this.imgflip.searchMeme(query)
    .then((memes) => {
      window.scrollTo(0, 0)
      if (memes.length > 0) this.setSearchResultMemes(memes)
      else this.setUIState(UIState.NoMemesFound)
    })
  }

  setSearchResultMemes(memes: Meme[]) {
    this.setState(prevState => ({
      ...prevState,
      uiState: UIState.SearchResults,
      searchResultMemes: memes
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
    this.setSearchResultMemes([])
    this.setUIState(UIState.Home)
    if (this.state.popularMemes.length === 0) {
      this.fetchPopularMemes()
    }
  }

  onMemeLoadError(meme: Meme) {
    this.setPopularMemes(this.state.popularMemes.filter((element: Meme) => {return element !== meme}))
    this.setSearchResultMemes(this.state.searchResultMemes.filter((element: Meme) => {return element !== meme}))
    this.setRecentMemes(this.state.recentMemes.filter((element: Meme) => {return element !== meme}))
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
            recentMemes={state.recentMemes}
            popularMemes={state.popularMemes}
            searchResultMemes={state.searchResultMemes}
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