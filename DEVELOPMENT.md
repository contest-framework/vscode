# Developer Guide

### setup

- clone the repo
- install [Node.js](https://nodejs.org)
- run <code type="npm/script-call">npm run setup</code>

### test

- run tests: <code type="npm/script-call">npm run test</code>

To try the extension out locally:

- run the tests to populate the local `out` folder
- menu: Run > Run Without Debugging
- in the new VSCode instance that pops up: File > Open Folder > select folder
  that isn't open in a VSCode instance yet

Local installation:

- <code type="npm/script-call">npm run package</code>
- run `code --install-extension contest-*.vsix` in terminal
- restart VSCode

### debug

Debug in VSCode:

- set breakpoints in VSCode
- open Debug view: VSCode menu: `View` > `Run`
- choose `Run Extension`
- click on the `play` icon
- open folder > choose a different folder than the current one

### update

- <code type="npm/script-call">npm run update</code>

### release

- <code type="npm/script-call">npm run publish-patch</code>
- <code type="npm/script-call">npm run publish-minor</code>
- <code type="npm/script-call">npm run publish-major</code>
