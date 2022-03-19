import { LoadingIndicator, MiddleAlign, Stack, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { Component, ComponentChild, Fragment, h } from "preact";
import { MemesGrid } from "./memes_grid";
import styles from "./styles.css";

export enum UIState {
  Home,
  SearchResults,
  NoMemesFound, 
  Loading,
  NetworkError
}

export class UIContainer extends Component<any, any> {

  render(props?: any, state?: Readonly<any>, context?: any): ComponentChild {
    return this.getScreen.bind(this)(props.uiState)
  }

  getScreen(uiState: UIState): ComponentChild {
    switch (uiState) {

      case UIState.NoMemesFound: {
        return <MiddleAlign> 
          <Text align="center">No memes found.<br/>Try searching for something else.</Text>
          </MiddleAlign>
      }

      case UIState.Loading: {
        return <MiddleAlign> <LoadingIndicator /> </MiddleAlign>
      }

      case UIState.NetworkError: {
        return <MiddleAlign> 
          <Text align="center">No internet connection detected.<br/>Try again later.</Text>
          </MiddleAlign>
      }
      
      case UIState.Home: return this.getHomeLayout()

      case UIState.SearchResults: return this.getSearchResultsLayout()
    }
  }

  getHomeLayout(): ComponentChild {
    return (
      <Fragment>
        {
          this.props.recentMemes.length > 0 &&
          <Fragment>
            <VerticalSpace space="medium" />
            <MemesGrid 
              memes={this.props.recentMemes} 
              class={styles.recentMemeGrid} 
              onError={this.props.onMemeLoadError} 
            />
          </Fragment>
        }
        <VerticalSpace space="large" />
        <MemesGrid 
          memes={this.props.popularMemes} 
          class={styles.memeGrid} 
          onError={this.props.onMemeLoadError} 
        />
      </Fragment>
    )
  }

  getSearchResultsLayout() {
    return (
      <MemesGrid 
        memes={this.props.searchResultMemes}
        class={styles.memeGrid} 
        onError={this.props.onMemeLoadError}
      />
    )
  }
  
}