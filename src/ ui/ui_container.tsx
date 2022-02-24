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
    return this.getScreen(props.uiState, props.memes)
  }

  getScreen(uiState: UIState, memes: any): ComponentChild {
    switch (uiState) {
      case UIState.NoMemesFound: return <text>No memes found</text>
      case UIState.Loading: return <text>loading</text>
      case UIState.NetworkError: return <text>can't find internet... how are you even using Figma right now?</text>
      case UIState.Memes: 
      default: return <MemesGrid memes={memes} />
    }
  }
}