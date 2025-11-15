# <img src="https://raw.githubusercontent.com/contest-framework/vscode/refs/heads/main/icons/300.png" width="50" height="41" valign="bottom"> Contest client for VSCode

![CI badge](https://github.com/contest-framework/vscode/actions/workflows/main.yml/badge.svg)

### install

This extension is
[available](https://marketplace.visualstudio.com/items?itemName=kevgo.contest-vscode)
in the Visual Studio marketplace. Please don't forget to also install the
[Contest server](https://github.com/contest/server).

### use

1. Arrange a terminal and VSCode on your screen(s) so that you see both. You can
   use the terminal built into VSCode or an external one here.
2. Start the server by running `contest` in that terminal.
3. Open Visual Studio's command palette by pressing (`Ctrl-Shift-P` or
   `Cmd-Shift-P`). Enter `contest` to trim the list of available commands.
   Choose one of these commands:

<table type="commands">
  <tr>
    <td><b>Test the active file on save</b></td>
    <td>Tests the file that is active in your editor when you save</td>
  </tr>
  <tr>
    <td><b>Test the active file on double-save</b></td>
    <td>Tests the file that is active in your editer when you save twice within <a>500</a>ms</td>
  </tr>
  <tr>
    <td><b>Test everything</b></td>
    <td>Runs all tests once</td>
  </tr>
  <tr >
    <td><b>Test everything on save</b></td>
    <td>Runs all tests every time you save any file in your editor</td>
  </tr>
  <tr>
    <td><b>Test everything on double-save</b></td>
    <td>Runs all tests every time you save twice within <a>500</a> milliseconds</td>
  </tr>
  <tr>
    <td><b>Test this file</b></td>
    <td>Tests the file that is active at the time you choose this command onec</td>
  </tr>
  <tr>
    <td><b>Test this file on save</b></td>
    <td>Tests the file that is active when you run this command, each time you save any file in your editor, no matter which file is active when you save</td>
  </tr>
  <tr>
    <td><b>Test this file on double-save</b></td>
    <td>Tests the file that is active when you run this command, each time you save any file twice within <a>500</a> milliseconds no matter which file is active when you save</td>
  </tr>
  <tr>
    <td><b>Test this line in this file</b></td>
    <td>Runs the test for the given line in the currently active file</td>
  </tr>
  <tr>
    <td><b>Test this line in this file on save</b></td>
    <td>Runs the test for the given line in the currently active file, each time you save any file</td>
  </tr>
  <tr>
    <td><b>Test this line in this file on double-save</b></td>
    <td>Runs the test for the given line in the currently active file, each time you save any file twice within 500 milliseconds</td>
  </tr>
  <tr>
    <td><b>Repeat the last test</b></td>
    <td>re-runs the last test that Contest ran, once</td>
  </tr>
  <tr>
    <td><b>Start/Stop repeat the last test on save</b></td>
    <td>re-runs the last test that Contest ran, each time you save any file</td>
  </tr>
  <tr>
    <td><b>Start/Stop repeat the last test on double-save</b></td>
    <td>re-runs the last test that Contest ran, each time you save any file twice within 500 ms</td>
  </tr>
  <tr>
    <td><b>Stop the current test</b></td>
    <td>If a test is currently running or hanging, stops it</td>
  </tr>
  <tr>
    <td><b>Quit the Contest server</b></td>
    <td>If the Contest server or the terminal/shell that the server runs in hangs, sends a signal to the server to quit</td>
  </tr>
</table>

### develop

See the [developer guide](DEVELOPMENT.md).
