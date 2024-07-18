# <img src="icons/300.png" width="50" height="41" valign="bottom"> Contest client for VSCode

![CI badge](https://github.com/contest/vscode/actions/workflows/main.yml/badge.svg)

### install

This extension is [available](https://marketplace.visualstudio.com/items?itemName=kevgo.contest-vscode) in the Visual
Studio marketplace. Please don't forget to also install the
<img src="icons/300.png" width="30" height="25" valign="bottom"> [server](https://github.com/contest/server).

### use

1. Arrange a terminal and VSCode on your screen(s) so that you see both. You can use the terminal built into VSCode or
   an external one here.
2. Start the server by running `contest` in that terminal.
3. Open Visual Studio's command palette by pressing (`Ctrl-Shift-P` or `Cmd-Shift-P`). Enter `contest` to trim the list
   of available commands. Choose one of these commands:

<table type="commands">
  <tr>
    <td><b>testAll</b></td>
    <td>Test everything</td>
  </tr>
  <tr>
    <td><b>testFile</b></td>
    <td>Test this file</td>
  </tr>
  <tr>
    <td><b>testFileLine</b></td>
    <td>Test the code at this line in this file</td>
  </tr>
  <tr>
    <td><b>repeatTest</b></td>
    <td>Repeat the last test</td>
  </tr>
  <tr>
    <td><b>stopTest</b></td>
    <td>Stop the current test</td>
  </tr>
  <tr>
    <td><b>autoRepeat</b></td>
    <td>Start/Stop auto-repeat on file save</td>
  </tr>
  <tr>
    <td><b>autoTestCurrentFile</b></td>
    <td>Auto-test the current file on save</td>
  </tr>
</table>

### develop

See the [developer guide](DEVELOPMENT.md).
