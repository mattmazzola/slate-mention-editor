import * as React from 'react'
import './App.css'
import * as C from './components'
import Plain from 'slate-plain-serializer'

interface State {
  options: C.IOption[]
  value: C.SlateValue
  readOnly: boolean
  mentions: C.IOption[]
}

const initialState: State = {
  options: [
    {
      id: "1",
      name: "James"
    },
    {
      id: "2",
      name: "John"
    },
    {
      id: "3",
      name: "Robert"
    },
    {
      id: "4",
      name: "Michael"
    },
    {
      id: "5",
      name: "William"
    },
    {
      id: "6",
      name: "David"
    },
    {
      id: "7",
      name: "Mary"
    },
    {
      id: "8",
      name: "Patricia"
    },
    {
      id: "9",
      name: "Linda"
    },
    {
      id: "10",
      name: "Barbara"
    },
    {
      id: "11",
      name: "Elizabeth"
    },
    {
      id: "12",
      name: "Jennifer"
    }
  ],
  mentions: [],
  value: Plain.deserialize(''),
  readOnly: false
}
class App extends React.Component<{}, State> {
  state = initialState

  onChange = (value: any) => {
    const mentions = C.Utilities.getOptionsFromValue(value)
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
          <h1 className="title">&lt;SlateMetionEditor /&gt;</h1>
          <div className="main-demo">
            <div className="demo">
              <C.Editor
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
                <div className="labels">
                  {this.state.options.map(o =>
                    <div key={o.id}>{o.name}</div>
                  )}
                </div>
              </div>

              <div>
                <div className="header">Mentions:</div>
                <div className="labels">
                  {this.state.mentions.map((m, i) =>
                    <React.Fragment key={i}>
                      <div>{m.name}</div>
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
            <p>React component to help insert a special known word while typing a message. User initiates the mention with a special character such as '$'. From here a list of options appear using the partially written text after the starting character as search term. The user can press 'Enter' or 'Tab' to complete/select the term against the currently matched option. User can also use arrow keys to navigate the list of options. Original use case is mentioning friends while typing a post on social media like Twitter or Facebook, but the list of friends can be any set of words for your application and context. This allows embedding rich items of imformation within text. A similar <a href="https://www.draft-js-plugins.com/plugin/mention">plugin</a> was written for <a href="https://draftjs.org/">draft.js</a>, but it was tough to customize. This is more flexible and built on <a href="https://www.slatejs.org" target="_blank" >slate.js</a>.</p>
            <h2>Getting Started</h2>
            <div>
              <b>1. Install</b>
              <pre>
                npm i slate-mention-editor
              </pre>
              <b>2. Import</b>
              <pre>
                import {'{'} SlateMentionEditor {'}'} from 'slate-mention-editor'
              </pre>
              <b>3. Declare</b>
              <pre>
{`<SlateMentionEditor
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
            <li>🎉  Mentions are highlighted so make use aware of usage and completion.</li>
            <li>🚀  User may have more than one mention.</li>
          </ul>

          <h2>🤔 Design Philosophy:</h2>
          <p>This usage of component is modeled after normal React controlled inputs. Example: <code>&lt;input value={'{'}text{'}'} onChange={'{'}this.onChange{'}'} /&gt;</code>.  Internally there is a <a href="https://www.slatejs.org" target="_blank">Slate.js</a> editor so the controlled value is a Slate value instead of a string.  There is a plugin for the mention behavior, but this more than just a plugin because we also have the option picker which is a separate menu whose state is updated when the Slate editor state is updated.</p> This separate menus is placed near the cursor and holds the closest matches for the metion. The arrow keys allow navigation of the matches without changing position of the cursor in original text. Enter is not allowed in the original text so it can be used for autocomplete. 
          The user can type text and when they want to mention a special word they can press the special character to begin the search.

          <h3>Diagram</h3>
          <p>Notice the internal update cycle and the external update cycle</p>

          <h2>🔧 Internals:</h2>
          <p>If you're interested in how two inputs: string of text, and list of labeled entities converted into slate value for render</p>
          <pre>{`convertEntitiesAndTextToTokenizedEditorValue(text, labeledEntities)`}</pre>
          <div className="steps">
              <div>{`1. tokenizeText(text)`}</div>
              <div>{`2. labeledTokens(tokenzedText, labeledEntities)`}</div>
              <div>{`3. convertToSlateValue(labeledTokens)`}</div>
              <pre className="code-block">{JSON.stringify({}, null, '  ')}</pre>
              <pre className="code-block">{JSON.stringify({}, null, '  ')}</pre>
              <pre className="code-block">{JSON.stringify({}, null, '  ')}</pre>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
