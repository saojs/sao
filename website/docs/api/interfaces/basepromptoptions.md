---
id: "basepromptoptions"
title: "Interface: BasePromptOptions"
sidebar_label: "BasePromptOptions"
---

## Hierarchy

* **BasePromptOptions**

  ↳ [*StringPromptOptions*](stringpromptoptions.md)

  ↳ [*ArrayPromptOptions*](arraypromptoptions.md)

  ↳ [*BooleanPromptOptions*](booleanpromptoptions.md)

## Properties

### format

• `Optional` **format**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *Promise*<*string*\> \| *string*

Function to format user input in the terminal.

Defined in: [src/utils/prompt.ts:40](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L40)

___

### message

• **message**: *string*

The message to display when the prompt is rendered in the terminal.

Defined in: [src/utils/prompt.ts:24](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L24)

___

### name

• **name**: *string*

Used as the key for the answer on the returned values (answers) object.

Defined in: [src/utils/prompt.ts:20](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L20)

___

### result

• `Optional` **result**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *any*

Function to format the final submitted value before it's returned.

Defined in: [src/utils/prompt.ts:36](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L36)

___

### skip

• `Optional` **skip**: (`state`: [*PromptState*](promptstate.md), `value`: *any*) => *boolean*

Skip the prompt when returns `true`

Defined in: [src/utils/prompt.ts:26](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L26)

___

### store

• `Optional` **store**: *boolean*

Store the prompt answer in order to reuse it as default value the next time
Defaults to `false`

Defined in: [src/utils/prompt.ts:45](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L45)

___

### validate

• `Optional` **validate**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *boolean* \| *string*

	Function to validate the submitted value before it's returned.
 This function may return a boolean or a string.
 If a string is returned it will be used as the validation error message.

Defined in: [src/utils/prompt.ts:32](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L32)
