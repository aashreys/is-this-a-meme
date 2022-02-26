import { IconButton, IconCross32, IconSearch32, Textbox, useInitialFocus } from "@create-figma-plugin/ui";
import { Component, ComponentChild, h, JSX } from "preact";
import styles from "./styles.css";

export class SearchContainer extends Component<any, any> {
  
  constructor(props: any) {
    super(props)
    this.state = {
      query: ''
    }
    this.bindMethods()
  }

  bindMethods() {
    this.setQuery = this.setQuery.bind(this)
    this.onSearchInput = this.onSearchInput.bind(this)
    this.onSearchKeyCapture = this.onSearchKeyCapture.bind(this)
    this.onSearchTrigger = this.onSearchTrigger.bind(this)
    this.onSearchClear = this.onSearchClear.bind(this)
  }

  setQuery(query: string) {
    this.setState(prevState => ({
      ...prevState,
      query: query
    }))
  }

  onSearchInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    this.setQuery(event.currentTarget.value)
  }

  onSearchKeyCapture(input: any) {
    if (input.key === 'Enter') {
      if (this.state.query.length > 0) {
        this.onSearchTrigger(this.state.query)
      } 
      else {
        this.onSearchClear()
      }
    }
  } 

  onSearchTrigger(query: string) {
    this.props.onSearchTrigger(query)
  }

  onSearchClear() {
    this.props.onSearchClear()
  }

  onClearButtonClick() {
    this.setQuery('')
    this.onSearchClear()
  }

  render(props: any, state: Readonly<any>, context?: any): ComponentChild {
    return (
      <div class={styles.searchContainer}>
      
        <div style="flex-grow: 1">
          <Textbox      
            {...useInitialFocus()}       
            icon={<IconSearch32 />} 
            placeholder="Search memes..." 
            value={state.query}
            onInput={this.onSearchInput}
            onKeyDownCapture={this.onSearchKeyCapture}
          />
        </div>

        {
        state.query.length > 0 &&
        <div style="width: 4px" />
        }

        {
        state.query.length > 0 &&
        <IconButton onChange={() => {this.onClearButtonClick()}} value={false}> 
            <IconCross32 />
        </IconButton>
        }
        
      </div>
    )
  }

}