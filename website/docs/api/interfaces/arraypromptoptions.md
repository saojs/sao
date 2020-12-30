---
id: "arraypromptoptions"
title: "Interface: ArrayPromptOptions"
sidebar_label: "ArrayPromptOptions"
---

## Hierarchy

* [*BasePromptOptions*](basepromptoptions.md)

  ↳ **ArrayPromptOptions**

## Properties

### align

• `Optional` **align**: *left* \| *right*

Defined in: [src/utils/prompt.ts:80](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L80)

___

### choices

• **choices**: *WithPromptState*<*string*[] \| Choice[]\>

Defined in: [src/utils/prompt.ts:68](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L68)

___

### default

• `Optional` **default**: *WithPromptState*<*string*\>

Default value for the prompt

Defined in: [src/utils/prompt.ts:74](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L74)

___

### delay

• `Optional` **delay**: *number*

Defined in: [src/utils/prompt.ts:75](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L75)

___

### edgeLength

• `Optional` **edgeLength**: *number*

Defined in: [src/utils/prompt.ts:79](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L79)

___

### format

• `Optional` **format**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *Promise*<*string*\> \| *string*

Function to format user input in the terminal.

Inherited from: [BasePromptOptions](basepromptoptions.md).[format](basepromptoptions.md#format)

Defined in: [src/utils/prompt.ts:40](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L40)

___

### linebreak

• `Optional` **linebreak**: *boolean*

Defined in: [src/utils/prompt.ts:78](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L78)

___

### maxChoices

• `Optional` **maxChoices**: *number*

Maxium number of options to select

Defined in: [src/utils/prompt.ts:70](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L70)

___

### message

• **message**: *string*

The message to display when the prompt is rendered in the terminal.

Inherited from: [BasePromptOptions](basepromptoptions.md).[message](basepromptoptions.md#message)

Defined in: [src/utils/prompt.ts:24](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L24)

___

### muliple

• `Optional` **muliple**: *boolean*

Allow to select multiple options

Defined in: [src/utils/prompt.ts:72](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L72)

___

### name

• **name**: *string*

Used as the key for the answer on the returned values (answers) object.

Inherited from: [BasePromptOptions](basepromptoptions.md).[name](basepromptoptions.md#name)

Defined in: [src/utils/prompt.ts:20](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L20)

___

### result

• `Optional` **result**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *any*

Function to format the final submitted value before it's returned.

Inherited from: [BasePromptOptions](basepromptoptions.md).[result](basepromptoptions.md#result)

Defined in: [src/utils/prompt.ts:36](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L36)

___

### scroll

• `Optional` **scroll**: *boolean*

Make the options scrollable via arrow keys

Defined in: [src/utils/prompt.ts:82](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L82)

___

### separator

• `Optional` **separator**: *boolean*

Defined in: [src/utils/prompt.ts:76](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L76)

___

### skip

• `Optional` **skip**: (`state`: [*PromptState*](promptstate.md), `value`: *any*) => *boolean*

Skip the prompt when returns `true`

Inherited from: [BasePromptOptions](basepromptoptions.md).[skip](basepromptoptions.md#skip)

Defined in: [src/utils/prompt.ts:26](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L26)

___

### sort

• `Optional` **sort**: *boolean*

Defined in: [src/utils/prompt.ts:77](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L77)

___

### store

• `Optional` **store**: *boolean*

Store the prompt answer in order to reuse it as default value the next time
Defaults to `false`

Inherited from: [BasePromptOptions](basepromptoptions.md).[store](basepromptoptions.md#store)

Defined in: [src/utils/prompt.ts:45](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L45)

___

### type

• **type**: *autocomplete* \| *editable* \| *form* \| *multiselect* \| *select* \| *survey* \| *list* \| *scale*

Defined in: [src/utils/prompt.ts:59](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L59)

___

### validate

• `Optional` **validate**: (`value`: *string*, `state`: [*PromptState*](promptstate.md)) => *boolean* \| *string*

	Function to validate the submitted value before it's returned.
 This function may return a boolean or a string.
 If a string is returned it will be used as the validation error message.

Inherited from: [BasePromptOptions](basepromptoptions.md).[validate](basepromptoptions.md#validate)

Defined in: [src/utils/prompt.ts:32](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L32)
