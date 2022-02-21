import {
  Container,
  IconSearch32,
  LoadingIndicator,
  MiddleAlign,
  render,
  Textbox
} from '@create-figma-plugin/ui'
import { Component, Fragment, h } from 'preact'
import { MemesGrid } from './ ui/memes_grid'
import styles from './ ui/styles.css'
import { ImgFlip } from './meme_providers/imgflip'
import { Meme } from './models/models'

class UI extends Component<any, any> {

  imgflip = new ImgFlip()
  popularMemes: Meme[] = []

  constructor(props: any) {
    super(props)
    this.state = {
      query: '',
      memes: []
    }
    this.fetchPopularMemes();
  }

  fetchPopularMemes() {
    this.imgflip.getPopularMemes()
    .then((memes) => {
      this.popularMemes = memes
      this.setMemes(this.popularMemes)
    })
  }

  searchForMemes(query: string) {
    this.imgflip.searchMeme(query)
    .then((memes) => {
      this.setMemes(memes)
    })
  }

  onSearchClear() {
    this.setMemes(this.popularMemes)
  }

  setMemes(memes: Meme[]) {
    this.setState(prevState => ({
      ...prevState,
      memes: memes
    }))
  }

  render(props: any, state: any) {
    return (
      <Container>
        <div class={styles.searchContainer} >
          <Textbox icon={<IconSearch32 />} placeholder="Search memes..." value={state.query} />
        </div>
        <MemesGrid memes={state.memes} />
      </Container>
    )
  }
  
}

function Plugin(props: any) {

  return ( <UI /> )

}

export default render(Plugin)

