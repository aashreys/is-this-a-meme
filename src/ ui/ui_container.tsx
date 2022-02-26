import { Button, LoadingIndicator, MiddleAlign, Text } from "@create-figma-plugin/ui";
import { Component, ComponentChild, h } from "preact";
import { MemesGrid } from "./memes_grid";

export enum UIState {
  Memes, // Used for both Popular Memes and Search Results
  NoMemesFound, 
  Loading,
  NetworkError
}

export class UIContainer extends Component<any, any> {

  render(props?: any, state?: Readonly<any>, context?: any): ComponentChild {
    return this.getScreen.bind(this)(props.uiState, props.memes)
  }

  getScreen(uiState: UIState, memes: any): ComponentChild {
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
      
      case UIState.Memes: 
      default: return <MemesGrid memes={memes} onError={this.props.onMemeLoadError} />
    }
  }
  
}