# [2.0.0-beta.1](https://github.com/saojs/sao/compare/v1.7.1...v2.0.0-beta.1) (2020-07-27)


### Features

* Release version 2 ([#145](https://github.com/saojs/sao/issues/145)) ([ca204d1](https://github.com/saojs/sao/commit/ca204d157f4c137dcafd2eeae5cd3691ed60c251))


### BREAKING CHANGES

Docs for SAO v1 can be found here: https://v1.saojs.org/

SAO v2 docs is still work in progress: https://saojs.org

## [1.7.1](https://github.com/saojs/sao/compare/v1.7.0...v1.7.1) (2020-05-12)


### Bug Fixes

* allow folders to be removed ([#144](https://github.com/saojs/sao/issues/144)) ([ab443aa](https://github.com/saojs/sao/commit/ab443aa555035b0c8e1c9b1e78b29b85cfe80ed3))



# [1.7.0](https://github.com/saojs/sao/compare/v1.6.1...v1.7.0) (2019-09-30)


### Features

* answers option ([#134](https://github.com/saojs/sao/issues/134)) ([2a2b324](https://github.com/saojs/sao/commit/2a2b324645c3edfeab5d025d85d6ea433b8c6438))



## [1.6.1](https://github.com/saojs/sao/compare/v1.6.0...v1.6.1) (2018-12-02)


### Bug Fixes

* allow action to override global config ([14d1fbf](https://github.com/saojs/sao/commit/14d1fbf3ec0f0c260a010f4e393619c09fa84552))



# [1.6.0](https://github.com/saojs/sao/compare/v1.5.0...v1.6.0) (2018-12-02)


### Bug Fixes

* do not use pnpm automatically ([676a7f9](https://github.com/saojs/sao/commit/676a7f9d5812202249600885b338cc7186ca3556))


### Features

* allow to use custom data for template interpolation ([6b291b5](https://github.com/saojs/sao/commit/6b291b5f9772eacda81adc01d218bec9c68f3258))



# [1.5.0](https://github.com/saojs/sao/compare/v1.4.1...v1.5.0) (2018-12-01)


### Bug Fixes

* specify program name to make it display correctly in pnpm ([743ddb2](https://github.com/saojs/sao/commit/743ddb2fb5cf407e120331912db22066a701256f))


### Features

* add pnpm support ([7017190](https://github.com/saojs/sao/commit/7017190a285007d9ed9eccdcfa0b0693bcb7a629))



## [1.4.1](https://github.com/saojs/sao/compare/v1.4.0...v1.4.1) (2018-11-26)


### Bug Fixes

* update cac ([e51fb8b](https://github.com/saojs/sao/commit/e51fb8b3d9216ddb19d113e08eee0808418e862c))



# [1.4.0](https://github.com/saojs/sao/compare/v1.3.2...v1.4.0) (2018-11-25)


### Features

* **cli:** upgrade to CAC 6 ([3ad34b0](https://github.com/saojs/sao/commit/3ad34b004b487a4905a13086809cff29a4537a3a))



## [1.3.2](https://github.com/saojs/sao/compare/v1.3.1...v1.3.2) (2018-11-20)


### Bug Fixes

* handle installArgs correctly ([dcdb7b3](https://github.com/saojs/sao/commit/dcdb7b30f3abc97108dc422dd42c4578621abe3a))



## [1.3.1](https://github.com/saojs/sao/compare/v1.3.0...v1.3.1) (2018-11-20)


### Bug Fixes

* do not transform binary path ([6240ad1](https://github.com/saojs/sao/commit/6240ad1e6e7c2f5c5896a66e19422c0a0e48c6f5)), closes [#112](https://github.com/saojs/sao/issues/112)



# [1.3.0](https://github.com/saojs/sao/compare/v1.2.1...v1.3.0) (2018-11-18)


### Features

* '--registry' option ([#109](https://github.com/saojs/sao/issues/109)) ([e944eb6](https://github.com/saojs/sao/commit/e944eb680ec822a4b4b1c6e7dd72293532c86130))



## [1.2.1](https://github.com/saojs/sao/compare/v1.2.0...v1.2.1) (2018-11-14)


### Bug Fixes

* added back --clone option ([#108](https://github.com/saojs/sao/issues/108)) ([ac55732](https://github.com/saojs/sao/commit/ac55732c5f386199179fa4e0ab371c2acebce00b))



# [1.2.0](https://github.com/saojs/sao/compare/v1.1.8...v1.2.0) (2018-11-13)


### Features

* **cli:** allow to set an alias name for a generator, added set-alias get-alias commands. ([4fc26cc](https://github.com/saojs/sao/commit/4fc26cce053d70bf1ca72421c87d68b47a9fbd38))



## [1.1.8](https://github.com/saojs/sao/compare/v1.1.7...v1.1.8) (2018-11-11)


### Bug Fixes

* rename generators option to subGenerators ([8996b0b](https://github.com/saojs/sao/commit/8996b0b8688f3a8bc6d2a70b945c751624904b85))
* rename subGenerator.from to subGenerator.generator ([d005ca6](https://github.com/saojs/sao/commit/d005ca6bee324dca4c2b1f811985655dad86dfd6))



## [1.1.7](https://github.com/saojs/sao/compare/v1.1.6...v1.1.7) (2018-11-10)


### Bug Fixes

* should not convert a Promise to boolean ([0d6f4f3](https://github.com/saojs/sao/commit/0d6f4f33b788d44a0cddb6c8be7e8de45f16f619))



## [1.1.6](https://github.com/saojs/sao/compare/v1.1.5...v1.1.6) (2018-11-10)


### Bug Fixes

* accept all options in generator.npmInstall ([f81ee43](https://github.com/saojs/sao/commit/f81ee435ec73a833a61ba3f9a96fcbd5ced56ec6))



## [1.1.5](https://github.com/saojs/sao/compare/v1.1.4...v1.1.5) (2018-11-07)


### Bug Fixes

* don't show update notifier for generators after being updated ([266bd06](https://github.com/saojs/sao/commit/266bd065dc44a16c15559b7fb5488551573e3db1))



## [1.1.4](https://github.com/saojs/sao/compare/v1.1.3...v1.1.4) (2018-11-06)


### Bug Fixes

* use relative pkg path and escape dots ([9a7ede4](https://github.com/saojs/sao/commit/9a7ede4eb7820a953079c933481f15ac03b3dd8a))



## [1.1.3](https://github.com/saojs/sao/compare/v1.1.2...v1.1.3) (2018-11-06)


### Bug Fixes

* cache answers by hash + pkg version ([e981a3f](https://github.com/saojs/sao/commit/e981a3f600c928b4d05c3aed755d441ad5353723))
* record used generators ([b1ab201](https://github.com/saojs/sao/commit/b1ab2017cf5ad8b9e081598654e554306fdfac44))



## [1.1.2](https://github.com/saojs/sao/compare/v1.1.1...v1.1.2) (2018-11-06)


### Bug Fixes

* clear cached answers when generator is updated ([86b54fc](https://github.com/saojs/sao/commit/86b54fc4e9775692111dc2dd61255e67a52e4a5b))



## [1.1.1](https://github.com/saojs/sao/compare/v1.1.0...v1.1.1) (2018-11-06)


### Bug Fixes

* remove updateCheckInterval ([7de5cf5](https://github.com/saojs/sao/commit/7de5cf5744a4a7046a5e3c669a57db6df606def2))



# [1.1.0](https://github.com/saojs/sao/compare/v1.0.3...v1.1.0) (2018-11-06)


### Features

* **cli:** add update-notifier ([2911dee](https://github.com/saojs/sao/commit/2911deed48fb2df510a136c295865ab490f72a8e))



## [1.0.3](https://github.com/saojs/sao/compare/v1.0.2...v1.0.3) (2018-11-06)


### Bug Fixes

* sub generator can only run in existing project ([f94dbdd](https://github.com/saojs/sao/commit/f94dbdd05d77a8a18d87a4f4acd4a7e75eb2592b))



## [1.0.2](https://github.com/saojs/sao/compare/v1.0.1...v1.0.2) (2018-11-06)


### Bug Fixes

* stop spinner when failed to download repo ([0be4193](https://github.com/saojs/sao/commit/0be41932f0cb0c0253949b8377e190e6d5a8eefb))



## [1.0.1](https://github.com/saojs/sao/compare/v1.0.0...v1.0.1) (2018-11-06)


### Bug Fixes

* do not store cache by package version ([4e9743e](https://github.com/saojs/sao/commit/4e9743ea8a6bebcb1aeb0ceb7d79b0e4585177fa))



