import { Component, createRef, h} from "preact";
import { EVENT_MEME_CLICK } from "../main";
import { Meme } from "../models/models";
import styles, { memeContainer } from "./styles.css";
import { emit } from '@create-figma-plugin/utilities'

export class MemeContainer extends Component<any, any> {

  ref = createRef();

  constructor(props: any) {
    super(props)
    this.bindMethods();
  }

  bindMethods() {
    this.sendMemeToFigma = this.sendMemeToFigma.bind(this);
  }

  sendMemeToFigma() {
    const img = this.ref.current
    const imageToBytes = async (resolve: any, reject: any) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      if (context !== null) {
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        canvas.toBlob(
          blob => {
            const reader = new FileReader()
            reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBufferLike))
            reader.onerror = () => reject(new Error('Could not read from blob'))
            reader.readAsArrayBuffer(blob as Blob)
          }
        )
      } else {
        // send error to Figma
      }
    }

    imageToBytes(
      (bytes: any) => {
        emit(EVENT_MEME_CLICK, {
          meme: this.props.meme,
          bytes: bytes,
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      },
      (error: any) => {
        console.log('error while converting image to bytes')
      }
    )
  }

  render(props: any, state: any) {
    const meme: Meme = props.meme
    return (
      <div class={styles.memeContainer}>
        <img 
          ref={this.ref} 
          class={styles.memeImg} 
          crossOrigin="anonymous" 
          src={meme.url} 
          alt={meme.name}
          draggable={false} 
          onClick={this.sendMemeToFigma} 
          onError={() => props.onError(meme)}
        />
      </div>
    )
  }
}