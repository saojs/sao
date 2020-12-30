---
id: "generatorconfig"
title: "Interface: GeneratorConfig"
sidebar_label: "GeneratorConfig"
---

## Hierarchy

* **GeneratorConfig**

## Properties

### actions

• `Optional` **actions**: Action[] \| (`this`: [*SAO*](../classes/sao.md), `ctx`: [*SAO*](../classes/sao.md)) => Action[] \| *Promise*<Action[]\>

Use actions to control how files are generated

Defined in: [src/generator-config.ts:85](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L85)

___

### completed

• `Optional` **completed**: (`this`: [*SAO*](../classes/sao.md), `ctx`: [*SAO*](../classes/sao.md)) => *Promise*<*void*\> \| *void*

Run some operations when completed
e.g. log some success message

Defined in: [src/generator-config.ts:106](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L106)

___

### data

• `Optional` **data**: DataFunction

Extra data to use in template transformation

Defined in: [src/generator-config.ts:75](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L75)

___

### description

• `Optional` **description**: *string*

Generator description
Used in CLI output

Defined in: [src/generator-config.ts:61](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L61)

___

### prepare

• `Optional` **prepare**: (`this`: [*SAO*](../classes/sao.md), `ctx`: [*SAO*](../classes/sao.md)) => *Promise*<*void*\> \| *void*

Run some operations before starting

Defined in: [src/generator-config.ts:101](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L101)

___

### prompts

• `Optional` **prompts**: [*PromptOptions*](../modules.md#promptoptions)[] \| (`this`: [*SAO*](../classes/sao.md), `ctx`: [*SAO*](../classes/sao.md)) => [*PromptOptions*](../modules.md#promptoptions)[] \| *Promise*<[*PromptOptions*](../modules.md#promptoptions)[]\>

Use prompts to ask questions before generating project

Defined in: [src/generator-config.ts:79](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L79)

___

### subGenerators

• `Optional` **subGenerators**: *Array*<{ `generator`: *string* ; `name`: *string*  }\>

Sub generator

Defined in: [src/generator-config.ts:94](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L94)

___

### templateDir

• `Optional` **templateDir**: *string*

Directory to template folder
Defaults to `./template` in your generator folder

Defined in: [src/generator-config.ts:90](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L90)

___

### transform

• `Optional` **transform**: *boolean*

Transform template content with `ejs`
Defaults to `true`

Defined in: [src/generator-config.ts:71](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L71)

___

### updateCheck

• `Optional` **updateCheck**: *boolean*

Check updates for npm generators
Defaults to `true`

Defined in: [src/generator-config.ts:66](https://github.com/saojs/sao/blob/7f66560/src/generator-config.ts#L66)
