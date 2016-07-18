# Caché Web Terminal
Web-based terminal application for InterSystems Caché database. Access your database from everywhere!

Visit [project page](http://intersystems-ru.github.io/webterminal) for more details, **download** the latest version [here](http://intersystems-ru.github.io/webterminal/#downloads).

### Installation
Download the latest version from <a href="http://intersystems-ru.github.io/webterminal/#downloads">project page</a>
and import XML file into any namespace. Later you can update application only by typing `/update` command in terminal.

### Usage
After installation, you will be able to access application at `http://[host]:[port]/terminal/` (slash at the end is required).
Type `/help` there to get more information.

### Features
<table>
	<tr>
		<td class="info">Native browser application</td>
		<td>This allows to access terminal both from desktop or mobile devices. No Telnet, only HTTP and WebSocket.</td>
	</tr>
	<tr>
		<td class="info">Autocompletion</td>
		<td>Enables you to complete your input faster. Except keywords, autocomplete also available for classes, properties and globals.</td>
	</tr>
	<tr>
		<td class="info">Tracing</td>
		<td>Monitor any changes in globals or files.</td>
	</tr>
	<tr>
		<td class="info">SQL mode</td>
		<td>Execute SQL queries simply by switching to SQL mode.</td>
	</tr>
	<tr>
		<td class="info">Syntax highlighting</td>
		<td>Visually attractive highlighted input.</td>
	</tr>
	<tr>
		<td class="info">Appearance</td>
		<td>Change the appearance of web-terminal or even code you own.</td>
	</tr>
	<tr>
		<td class="info">Favorites</td>
		<td>Remember your best commands for later execution.</td>
	</tr>
	<tr>
		<td class="info">Definitions</td>
		<td>Define any piece of code as short expression and make your administering experience faster.</td>
	</tr>
	<tr>
		<td class="info">Security</td>
		<td>Access to WebSocket is granted only if client will pass a session key given by csp page.</td>
	</tr>
	<tr>
		<td class="info">Self-updating</td>
		<td>Terminal version 3.1.4 and higher can be automatically updated by using `/update` command.</td>
	</tr>
	<tr>
		<td class="info">Explore!</td>
		<td>Hope you will find this useful.</td>
	</tr>
</table>

Development
-----------

We are glad to see anyone who want to contribute to Caché WEB Terminal development! Check the 
[developer's](https://github.com/intersystems-ru/webterminal/blob/master/DEVELOPMENT.md) guide.

In short, the "hot start" is extremely easy. Having latest [Git](https://git-scm.com/) and
[NodeJS](https://nodejs.org/en/) installed (tested on NodeJS v4-6), execute the following:

```sh
git clone https://github.com/intersystems-ru/webterminal
cd webterminal                   # enter just created directory
npm install                      # install all project's dependencies

npm run build                    # build the project
# OR edit import.bat script (on Windows) and then use only the following command:
import
```

Now, in `build` folder you will find `CacheWebTerminal-v*.xml` file ready to import. Every time you
changes is ready to be tested, just run `gulp` command and import generated XML into Caché. 


Integration and WebTerminal's API
---------------------------------

To embed WebTerminal to any other web application, you can use `<iframe>` tag.
Example:

```html
<iframe id="terminal" src="http://127.0.0.1:57772/terminal/"></iframe>
```

To use WebTerminal's API, you need to get WebTerminal instance first. Use iframe's
`onTerminalInit` function to get it.

```js
document.querySelector("#terminal").contentWindow.onTerminalInit(function (terminal) {
    // now work with terminal object here!
});
```

The next table demonstrates available API. Left column are `terminal` object properties.

<table>
	<tr>
		<td>Function</td>
		<td>Description</td>
	</tr>
	<tr>
        <td>onUserEntry(<b>cb</b>)</td>
        <td>
            <b>cb</b>(<u>text</u>, <u>mode</u>) is fired right after user press enter. Argument
            <code>text</code> is a <code>String</code> of user input, and
            <code>mode</code> is a <code>Number</code>, which can be compared
            with one of the terminal mode constants, such as <code>MODE_PROMPT</code>.
        </td>
    </tr>
</table>

<table>
    <tr>
		<td>Constant</td>
		<td>Description</td>
	</tr>
    <tr><td>MODE_PROMPT</td><td>Regular input (COS command)</td></tr>
    <tr><td>MODE_SQL</td><td>Input in SQL mode (SQL command)</td></tr>
    <tr><td>MODE_READ_CHAR</td><td>Prompt issued by COS <code>read c</code> command</td></tr>
    <tr><td>MODE_CHAR</td><td>Prompt issued by COS <code>read *c</code> command</td></tr>
</table>

Examples of usage:

```js
document.querySelector("#terminal").contentWindow.onTerminalInit(function (terminal) {
    terminal.onUserEntry(function (text, mode) {
        if (mode === webTerminal.input.MODE_PROMPT) {
            alert("User entered the next command: " + text);
        }
    });
});
```