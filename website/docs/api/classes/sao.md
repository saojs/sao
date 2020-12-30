---
id: "sao"
title: "Class: SAO"
sidebar_label: "SAO"
---

## Hierarchy

* **SAO**

## Constructors

### constructor

\+ **new SAO**(`opts`: [*Options*](../interfaces/options.md)): [*SAO*](sao.md)

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [*Options*](../interfaces/options.md) |

**Returns:** [*SAO*](sao.md)

Defined in: [src/index.ts:72](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L72)

## Properties

### \_answers

• `Private` **\_answers**: { [k: string]: *any*;  } \| *symbol*

Defined in: [src/index.ts:68](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L68)

___

### \_data

• `Private` **\_data**: { [k: string]: *any*;  } \| *symbol*

Defined in: [src/index.ts:69](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L69)

___

### colors

• **colors**: Chalk & ChalkFunction & { `BackgroundColor`: BackgroundColor ; `Color`: Color ; `ForegroundColor`: ForegroundColor ; `Level`: chalk.Level ; `Modifiers`: Modifiers ; `stderr`: chalk.Chalk & { `supportsColor`: chalk.ColorSupport \| *false*  } ; `supportsColor`: chalk.ColorSupport \| *false*  }

Defined in: [src/index.ts:65](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L65)

___

### generatorList

• **generatorList**: GeneratorList

Defined in: [src/index.ts:72](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L72)

___

### logger

• **logger**: *Logger*

Defined in: [src/index.ts:66](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L66)

___

### opts

• **opts**: *SetRequired*<[*Options*](../interfaces/options.md), *outDir* \| *logLevel*\>

Defined in: [src/index.ts:63](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L63)

___

### parsedGenerator

• **parsedGenerator**: ParsedGenerator

Defined in: [src/index.ts:71](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L71)

___

### spinner

• **spinner**: Ora

Defined in: [src/index.ts:64](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L64)

## Accessors

### answers

• **answers**(): object

Retrive the answers

You can't access this in `prompts` function

**Returns:** object

Defined in: [src/index.ts:240](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L240)

• **answers**(`value`: { [k: string]: *any*;  }): *void*

Retrive the answers

You can't access this in `prompts` function

#### Parameters:

Name | Type |
------ | ------ |
`value` | { [k: string]: *any*;  } |

**Returns:** *void*

Defined in: [src/index.ts:247](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L247)

___

### data

• **data**(): *any*

**Returns:** *any*

Defined in: [src/index.ts:251](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L251)

___

### gitUser

• **gitUser**(): GitUser

Get the information of system git user

**Returns:** GitUser

Defined in: [src/index.ts:277](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L277)

___

### npmClient

• **npmClient**(): NPM\_CLIENT

The npm client

**Returns:** NPM\_CLIENT

Defined in: [src/index.ts:298](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L298)

___

### outDir

• **outDir**(): *string*

The absolute path to output directory

**Returns:** *string*

Defined in: [src/index.ts:291](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L291)

___

### outDirName

• **outDirName**(): *string*

The basename of output directory

**Returns:** *string*

Defined in: [src/index.ts:284](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L284)

___

### pkg

• **pkg**(): *any*

Read package.json from output directory

Returns an empty object when it doesn't exist

**Returns:** *any*

Defined in: [src/index.ts:266](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L266)

## Methods

### createError

▸ **createError**(`message`: *string*): *SAOError*

Create an SAO Error so we can pretty print the error message instead of showing full error stack

#### Parameters:

Name | Type |
------ | ------ |
`message` | *string* |

**Returns:** *SAOError*

Defined in: [src/index.ts:355](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L355)

___

### getGenerator

▸ **getGenerator**(`generator?`: ParsedGenerator, `hasParent?`: *boolean*): *Promise*<{ `config`: [*GeneratorConfig*](../interfaces/generatorconfig.md) ; `generator`: ParsedGenerator  }\>

Get actual generator to run and its config
Download it if not yet cached

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`generator` | ParsedGenerator | ... |
`hasParent?` | *boolean* | - |

**Returns:** *Promise*<{ `config`: [*GeneratorConfig*](../interfaces/generatorconfig.md) ; `generator`: ParsedGenerator  }\>

Defined in: [src/index.ts:137](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L137)

___

### getGeneratorHelp

▸ **getGeneratorHelp**(): *Promise*<*string*\>

Get the help message for current generator

Used by SAO CLI, in general you don't want to touch this

**Returns:** *Promise*<*string*\>

Defined in: [src/index.ts:121](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L121)

___

### getOutputFiles

▸ **getOutputFiles**(): *Promise*<*string*[]\>

Get file list of output directory

**Returns:** *Promise*<*string*[]\>

Defined in: [src/index.ts:362](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L362)

___

### gitInit

▸ **gitInit**(): *void*

Run `git init` in output directly

It will fail silently when `git` is not available

**Returns:** *void*

Defined in: [src/index.ts:307](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L307)

___

### hasOutputFile

▸ **hasOutputFile**(`file`: *string*): *Promise*<*boolean*\>

Check if a file exists in output directory

#### Parameters:

Name | Type |
------ | ------ |
`file` | *string* |

**Returns:** *Promise*<*boolean*\>

Defined in: [src/index.ts:374](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L374)

___

### npmInstall

▸ **npmInstall**(`opts?`: *Pick*<InstallOptions, *npmClient* \| *installArgs* \| *packages* \| *saveDev*\>): *Promise*<{ `code`: *number*  }\>

Run `npm install` in output directory

#### Parameters:

Name | Type |
------ | ------ |
`opts?` | *Pick*<InstallOptions, *npmClient* \| *installArgs* \| *packages* \| *saveDev*\> |

**Returns:** *Promise*<{ `code`: *number*  }\>

Defined in: [src/index.ts:326](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L326)

___

### readOutputFile

▸ **readOutputFile**(`file`: *string*): *Promise*<*string*\>

Read a file in output directory

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`file` | *string* | file path    |

**Returns:** *Promise*<*string*\>

Defined in: [src/index.ts:382](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L382)

___

### run

▸ **run**(): *Promise*<*void*\>

**Returns:** *Promise*<*void*\>

Defined in: [src/index.ts:230](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L230)

___

### runGenerator

▸ **runGenerator**(`generator`: ParsedGenerator, `config`: [*GeneratorConfig*](../interfaces/generatorconfig.md)): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`generator` | ParsedGenerator |
`config` | [*GeneratorConfig*](../interfaces/generatorconfig.md) |

**Returns:** *Promise*<*void*\>

Defined in: [src/index.ts:199](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L199)

___

### showProjectTips

▸ **showProjectTips**(): *void*

Display a success message

**Returns:** *void*

Defined in: [src/index.ts:347](https://github.com/saojs/sao/blob/7f66560/src/index.ts#L347)
