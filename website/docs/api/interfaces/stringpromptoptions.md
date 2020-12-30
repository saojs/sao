---
id: "stringpromptoptions"
title: "Interface: StringPromptOptions"
sidebar_label: "StringPromptOptions"
---

## Hierarchy

* [*BasePromptOptions*](basepromptoptions.md)

  ↳ **StringPromptOptions**

## Properties

### default

• `Optional` **default**: *WithPromptState*<*string*\>

Default value for the prompt

Defined in: [src/utils/prompt.ts:94](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L94)

___

### format

• `Optional` **format**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *Promise*<*string*\> \| *string*

Function to format user input in the terminal.

Inherited from: [BasePromptOptions](basepromptoptions.md).[format](basepromptoptions.md#format)

Defined in: [src/utils/prompt.ts:40](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L40)

___

### message

• **message**: *string*

The message to display when the prompt is rendered in the terminal.

Inherited from: [BasePromptOptions](basepromptoptions.md).[message](basepromptoptions.md#message)

Defined in: [src/utils/prompt.ts:24](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L24)

___

### multiline

• `Optional` **multiline**: *boolean*

Allow the input to be multiple lines

Defined in: [src/utils/prompt.ts:96](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L96)

___

### name

• **name**: *string*

Used as the key for the answer on the returned values (answers) object.

Inherited from: [BasePromptOptions](basepromptoptions.md).[name](basepromptoptions.md#name)

Defined in: [src/utils/prompt.ts:20](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L20)

___

### result

• `Optional` **result**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *any*

Function to format the final submitted value before it's returned.

Inherited from: [BasePromptOptions](basepromptoptions.md).[result](basepromptoptions.md#result)

Defined in: [src/utils/prompt.ts:36](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L36)

___

### skip

• `Optional` **skip**: (`state`: [*PromptState*](promptstate.md), `value`: *any*) => *boolean*

Skip the prompt when returns `true`

Inherited from: [BasePromptOptions](basepromptoptions.md).[skip](basepromptoptions.md#skip)

Defined in: [src/utils/prompt.ts:26](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L26)

___

### store

• `Optional` **store**: *boolean*

Store the prompt answer in order to reuse it as default value the next time
Defaults to `false`

Inherited from: [BasePromptOptions](basepromptoptions.md).[store](basepromptoptions.md#store)

Defined in: [src/utils/prompt.ts:45](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L45)

___

### type

• **type**: *input* \| *invisible* \| *list* \| *password* \| *text*

Defined in: [src/utils/prompt.ts:92](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L92)

___

### validate

• `Optional` **validate**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *boolean* \| *string*

	Function to validate the submitted value before it's returned.
 This function may return a boolean or a string.
 If a string is returned it will be used as the validation error message.

Inherited from: [BasePromptOptions](basepromptoptions.md).[validate](basepromptoptions.md#validate)

Defined in: [src/utils/prompt.ts:32](https://github.com/saojs/sao/blob/ddc7421/src/utils/prompt.ts#L32)
