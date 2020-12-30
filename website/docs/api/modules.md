---
id: "modules"
title: "sao"
sidebar_label: "Index"
---

## Index

### Classes

* [SAO](classes/sao.md)

### Interfaces

* [ArrayPromptOptions](interfaces/arraypromptoptions.md)
* [BasePromptOptions](interfaces/basepromptoptions.md)
* [BooleanPromptOptions](interfaces/booleanpromptoptions.md)
* [GeneratorConfig](interfaces/generatorconfig.md)
* [Options](interfaces/options.md)
* [PromptState](interfaces/promptstate.md)
* [StringPromptOptions](interfaces/stringpromptoptions.md)

### Type aliases

* [PromptOptions](modules.md#promptoptions)

### Variables

* [generatorList](modules.md#generatorlist)
* [store](modules.md#store)

### Functions

* [handleError](modules.md#handleerror)
* [runCLI](modules.md#runcli)

## Type aliases

### PromptOptions

Ƭ **PromptOptions**: [*ArrayPromptOptions*](interfaces/arraypromptoptions.md) \| [*BooleanPromptOptions*](interfaces/booleanpromptoptions.md) \| [*StringPromptOptions*](interfaces/stringpromptoptions.md)

Defined in: [src/utils/prompt.ts:99](https://github.com/saojs/sao/blob/7f66560/src/utils/prompt.ts#L99)

## Variables

### generatorList

• `Const` **generatorList**: *GeneratorList*

Defined in: [src/utils/generator-list.ts:75](https://github.com/saojs/sao/blob/7f66560/src/utils/generator-list.ts#L75)

___

### store

• `Const` **store**: *Store*

Defined in: [src/store.ts:43](https://github.com/saojs/sao/blob/7f66560/src/store.ts#L43)

## Functions

### handleError

▸ **handleError**(`error`: *SAOError* \| Error): *void*

#### Parameters:

Name | Type |
------ | ------ |
`error` | *SAOError* \| Error |

**Returns:** *void*

Defined in: [src/error.ts:21](https://github.com/saojs/sao/blob/7f66560/src/error.ts#L21)

___

### runCLI

▸ **runCLI**(): *Promise*<*void*\>

**Returns:** *Promise*<*void*\>

Defined in: [src/cli-engine.ts:7](https://github.com/saojs/sao/blob/7f66560/src/cli-engine.ts#L7)
