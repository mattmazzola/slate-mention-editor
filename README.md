# Slate Mention Editor

## What is it?

React component to help insert a special known word while typing a message. Simiar to the [https://www.draft-js-plugins.com/plugin/mention](mention plugin) written for draft.js, this is more flexible and built on [https://www.slatejs.org](slate.js)

## Getting Started

Install

```
npm i slate-mention-editor
```

Import

```typescript
import { SlateMentionEditor } from 'slate-mention-editor'
```

Declare

```typescript
<SlateMentionEditor
  placeholder="Enter some text..."
  options={this.state.options}
  value={this.state.value}
  disabled={this.state.readOnly}
  onChange={this.onChange}
  onSubmit={this.onSubmit}
/>
```

## Demo

[https://mattmazzola.github.io/slate-mention-editor/]
(https://mattmazzola.github.io/slate-mention-editor/)

## Source

[https://github.com/mattmazzola/slate-mention-editor]
(https://github.com/mattmazzola/slate-mention-editor)