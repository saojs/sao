# Migrate from v0

For a user, you only need to `rm -rf ~/.sao` directory to use v1, but for a template author, there are some changes:

1. templates are now generators, they should be published as `sao-*` on npm now.
2. generator now uses `saofile.js` instead of `sao.js` to control the behavior.
3. many changes in `saofile.js`.

## Changes in saofile.js

Following root options are removed:

- data
- filters
- skipInterpolation
- enforceNewFolder
- enforceCurrentFolder
- move
- template
- templateOptions
- post

New complete list of root options:

- prompts
- transformer
- transformerOptions
- actions
- completed
- generators
