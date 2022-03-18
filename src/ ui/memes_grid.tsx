import { Component, h } from "preact"
import { Meme } from "../models/models"
import { MemeContainer } from "./meme_container"
import styles from "./styles.css"

export class MemesGrid extends Component<any, any> {

  render(props: any, state: any) {
    const memes: Meme[] = props.memes
    return (
      <div class={props.class}>
        {
          memes?.map((meme) => ( <MemeContainer meme={meme} onError={this.props.onError} /> ))
        }
      </div>
    )
  }
  
}