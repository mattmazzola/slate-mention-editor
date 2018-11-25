import * as React from 'react'
import './App.css'
import * as SME from './components'
import Plain from 'slate-plain-serializer'

interface IFriend extends SME.IOption {
  food: string
}

interface State {
  options: IFriend[]
  value: SME.SlateValue
  readOnly: boolean
  mentions: IFriend[]
}

const initialState: State = {
  options: [
    {
      id: "1",
      name: "James",
      food: "Pizza"
    },
    {
      id: "2",
      name: "John",
      food: "Coffee"
    },
    {
      id: "3",
      name: "Robert",
      food: "Smoothie"
    },
    {
      id: "4",
      name: "Michael",
      food: "Spaghetti"
    },
    {
      id: "5",
      name: "William",
      food: "Ice Cream"
    },
    {
      id: "6",
      name: "David",
      food: "Ravioli"
    },
    {
      id: "7",
      name: "Mary",
      food: "Bagel"
    },
    {
      id: "8",
      name: "Patricia",
      food: "Clam chowder"
    },
    {
      id: "9",
      name: "Linda",
      food: "Apple"
    },
    {
      id: "10",
      name: "Barbara",
      food: "Grapefruit"
    },
    {
      id: "11",
      name: "Elizabeth",
      food: "Salad"
    },
    {
      id: "12",
      name: "Jennifer",
      food: "Chicken"
    }
  ],
  mentions: [],
  value: Plain.deserialize(''),
  readOnly: false
}
class App extends React.Component<{}, State> {
  state = initialState

  onChange = (value: any) => {
    const mentions = SME.Utilities.getOptionsFromValue<IFriend>(value)
    if (mentions.length !== this.state.mentions.length) {
      console.log("onChange mentions: ", mentions)
    }

    this.setState({
      value,
      mentions
    })
  }

  onSubmit = () => {
    console.log("submit")
  }

  onClickReset = () => {
    this.setState({
      value: Plain.deserialize(''),
      mentions: []
    })
  }

  onChangeReadOnly = () => {
    this.setState(prevState => ({
      readOnly: !prevState.readOnly
    }))
  }

  public render() {
    return (
      <div className="App">
        <header>
          <h1 className="title">&lt;SlateMentionEditor /&gt;</h1>
          <div className="main-demo">
            <div className="demo">
              <SME.Editor
                placeholder="Enter some text..."
                options={this.state.options}
                value={this.state.value}
                disabled={this.state.readOnly}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
              />
            </div>

            <div className="commands">
              <button type="button" className="primary" onClick={this.onClickReset}>Reset</button>
              <label htmlFor="readOnlyCheckbox">
                <input id="readOnlyCheckbox" type="checkbox" onChange={this.onChangeReadOnly} />Read-Only
              </label>
            </div>

            <div className="state">
              <div>
                <div className="header">Options:</div>
                <div className="options">
                  {this.state.options.map(o =>
                    <div key={o.id}>{o.name}</div>
                  )}
                </div>
              </div>

              <div>
                <div className="header">Mentions:</div>
                <div className="labels">
                  {this.state.mentions.length === 0
                    ? <div>None</div>
                    : this.state.mentions.map((m, i) =>
                    <React.Fragment key={i}>
                      <div>{m.id}: {m.name}({m.food})</div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main>
          <section>
            <h2>What is it?</h2>
            <p>React component to help insert and autocomplete special known words while typing a message. User initiates the mention with a special character such as '$'. From here a list of options appear using the partially written text after the starting character as search term. The user can press 'Enter' or 'Tab' to complete/select the term using the currently matched option. User can also use arrow keys to navigate the list of options. Original use case is "mentioning" friends while typing a post on social media like Twitter or Facebook, but the list of friends can be any set of words for your application and context. This allows embedding rich items of imformation within text. A similar <a href="https://www.draft-js-plugins.com/plugin/mention">plugin</a> was written for <a href="https://draftjs.org/">draft.js</a>, but it was tough to customize. This is more flexible and built on <a href="https://www.slatejs.org" target="_blank" >slate.js</a>.</p>
            <h2>Getting Started</h2>
            <div>
              <b>1. Install</b>
              <pre>
                npm i slate-mention-editor
              </pre>
              <b>2. Import</b>
              <pre>
                import * as SME from 'slate-mention-editor'
              </pre>
              <b>3. Declare</b>
              <pre>
{`<SME.Editor
  placeholder="Enter some text..."
  options={this.state.options}
  value={this.state.value}
  disabled={this.state.readOnly}
  onChange={this.onChange}
  onSubmit={this.onSubmit}
/>`}
              </pre>
            </div>
          </section>

          <h2>📃 Requirements:</h2>
          <p>
            Allow plain text entry. Given a set of words allow those words to be 'mentioned' by typing a special character then contuing to type the word.
          </p>
          <h3>Must Haves</h3>
          <ul className="list">
            <li>✅ Use initiates mention by typing a special character.</li>
            <li>✅ User sees list of options based on partially completed mention.</li>
            <li>✅ User can press Tab to complete highlighted option.</li>
            <li>✅ User can press Enter to complete highlighted option.</li>
          </ul>
          <h3>Nice to haves</h3>
          <ul className="list">
            <li>🎂  User can navigate options with arrow keys.</li>
            <li>🎉  Mentions are highlighted so make user aware of usage and completion.</li>
            <li>🚀  User may have more than one mention.</li>
          </ul>

          <h2>🤔 Design Philosophy:</h2>
          <p>This usage of component is modeled after normal React controlled inputs. Example: <code>&lt;input value={'{'}text{'}'} onChange={'{'}this.onChange{'}'} /&gt;</code>.  Internally there is a <a href="https://www.slatejs.org" target="_blank">Slate.js</a> editor so the controlled value is a <code>SME.SlateValue</code> instead of a string.  Most of mention behavior / logic concerning adding inline nodes and manipulating the cursor is written as a Slate plugin, but because we also have to list the options picker which is a separate menu.  This is outside of plugin behavior and its state is updated when the Slate editor state is updated.</p><p>The closest matches are computed using <a href="http://fusejs.io/" target="_blank">fuse.js</a> and it is placed near the cursor as you type. The arrow keys allow navigation of the matches without changing position of the cursor in original text. Enter is not allowed in the original text so it can be used for autocomplete. In order to delete the entire mention we inspect if user is performing a <code>'remove_text'</code> operation and then check if it's within an inline node that represents the mention and delete the whole node.</p>

          The user can type text and when they want to mention a special word they can press the special character to begin the search.

          {/* <h3>Diagram</h3>
          <p>Notice the internal update cycle and the external update cycle</p> */}

          <h2>🔧 Internals:</h2>
          <p>Each mention is represented as an <a href="ttps://docs.slatejs.org/slate-core/inline">Inline</a> node which contains one Text node. When the specified trigger key ($) is entered an inline node is added/inserted into that position. As the user types the text is written the nodes inner Text node and that value is used to search within the list of options. We use the <code>onKeyDown()</code> to intercept and response to Up and Down arrow keys to change selected option without manipulating the cursor position inside the editr. Once the desired match is highlighted the user can press Tab or Enter to select it. In this case we take the selected option and overwrite the text node contents with the display value of the option.  We also call <code>collapseToStartOfNextText()</code> to move the cursor the next text node. This ensure typing after the mention is not included in the alread completed inline node. The effectively means each mention will be its own inline node allows for uique stylng and multiple occurrences.</p>

          <p>Also notice that you can include <i>any</i> information in the selected options as long as they have an id and name. The list of friends each have an associated food and the food is shown when they are "mentioned" in the text because the entire object is preserved when is stored on the inline node. There is a utility function <code>const mentions = SME.Utilities.getOptionsFromValue&gt;IFriend&lt;(value)</code> which accepts a generic type <code>T</code> which must extend <code>IOption</code>. This allows you to extract the items mentioned in the type given.</p>
        </main>
      </div>
    );
  }
}

export default App;
