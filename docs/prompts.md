# Prompts

The `prompts` option in `saofile.js` is an array of `PromptOptions` or a function which resolves to an array of `PromptOptions`.

Each `PromptOptions` object has a `type` property, which can be one of:

- `"input" | "invisible" | "list" | "password" | "text"`: Check out all properties available under [StringPromptOptions](#stringpromptoptions)
- `"confirm"`: Check out all properties available under [BooleanPromptOptions](#booleanpromptoptions)
- `"autocomplete" | "editable" | "form" | "multiselect" | "select" | "survey" | "list" | "scale"`: Check out all properties available under [ArrayPromptOptions](#arraypromptoptions)

## BasePromptOptions

Regardless of prompt type, they all have following properties.

### type

- Type: `string`
- Required: `true`

Prompt type, see the list above.

### name

- Type: `string`
- Required: `true`

Prompt name, used as the key for the answer on the returned values (answers) object.

### message

- Type: `string`
- Required: `true`

The message to display when the prompt is rendered in the terminal.

### skip

- Params:
  - `state`: [PromptState](#promptstate)
- Returns: `boolean`

```ts
type Skip = (state: PromptState) => boolean
```

Skip the prompt when it returns `true`.

### validate

- Params:
  - `value`: `string`, the current answer value
  - `state`: [PromptState](#promptstate)
- Returns: `boolean`, `string`

```ts
type Validate = (value: string, state: PromptState) => boolean | string
```

Function to validate the submitted value before it's returned. This function may return a boolean or a string. If a string is returned it will be used as the validation error message.

### format

- Params:
  - `value`: `string`, the current answer value
  - `state`: [PromptState](#promptstate)
- Returns: `Promise<string>`, `string`

```ts
type Format = (value: string, state: PromptState) => Promise<string> | string
```

Function to format user input in the terminal.

### result

- Params:
  - `value`: `string`, the current answer value
  - `state`: [PromptState](#promptstate)
- Returns: `any`

```ts
type Result = (value: string, state: PromptState) => any
```

Function to format the final submitted value to be set in the `answers` object.

### store

- Type: `boolean`
- Default: `false`

Store the prompt answer in order to reuse it as default value the next time.

## StringPromptOptions

This extends [BasePromptOptions](#basepromptoptions).

[TODO]

## BooleanPromptOptions

[TODO]

## ArrayPromptOptions

[TODO]

## PromptState

```ts
interface PromptState {
  // Prompt answers
  answers: {
    [promptName: string]: any
  }
}
```
