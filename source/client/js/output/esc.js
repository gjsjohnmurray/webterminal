import * as output from "./index";
import { COLOR_8BIT } from "./const";
import * as server from "../server";

/**
 * DO NOT use output.print function inside: it may bring unexpected result as print function uses
 * stack.
 */
export default {
    "\u000C": () => {
        output.clear();
    },
    "\n": () => {
        output.scrollDisplay(1);
    },
    "\r": () => {
        output.setCursorX(1);
    },
    // tab control
    "\t": () => {
        let x = output.getCursorX(),
            tabs = output.getTabs();
        for (let i = 0; i < tabs.length; i++) {
            if (x < tabs[i]) {
                output.setCursorX(tabs[i]);
                return;
            }
        }
    },
    "\x1bH": () => {
        output.setTabAt(output.getCursorX());
    },
    "\x1b[g": () => {
        output.clearTab(output.getCursorX());
    },
    "\x1b[3g": () => {
        output.clearTab();
    },
    // scrolling
    "\x1b[r": () => {
        output.disableScrolling();
    },
    "\x1b[{\\d*}{;?}{\\d*}r": (args) => {
        let start = args[0] || 1,
            end = args[2] || output.HEIGHT;
        if (!args[1])
            start = args[0] || args[2];
        if (!start) {
            output.disableScrolling();
            return;
        }
        output.enableScrolling(start, end);
    },
    "\x1bD": () => {
        output.scrollDisplay(1);
    },
    "\x1bM": () => {
        output.scrollDisplay(-1);
    },
    // device status
    "\x1b[c": () => {
        server.send(`i`, `\x1b10c`);
    },
    "\x1b[5n": () => {
        server.send(`i`, `\x1b0n`);
    },
    "\x1b[6n": () => {
        server.send(`i`, `\x1b[${ output.getCursorY() };${ output.getCursorY() }n`);
    },
    "\x1bc": () => {
        // Reset terminal settings to default. Caché TERM does not reset settings, indeed.
    },
    //
    "\x1b[{\\d*}{;?}{\\d*}H": (args) => { // cursor home
        if (args[0] || args[2]) {
            if (args[0])
                output.setCursorY(+args[0]);
            if (args[2])
                output.setCursorX(+args[2]);
        } else {
            output.setCursorX(1);
            output.setCursorY(1);
        }
    },
    "\x1b[{\\d*}G": (args) => {
        output.setCursorX(+args[0]);
    },
    "\x1b[{\\d*};\"{[^\"]}\"p": (args) => { // define key
        console.log("\\key!", args); // todo
    },
    "\x1b[{\\d+(?:;\\d+)*}m": (args) => {
        let indices = args[0].split(`;`);
        for (let i = 0; i < indices.length; i++) {
            if (indices[i] === "0") {
                output.resetGraphicProperties();
                continue;
            }
            if ((indices[i] === 38 || indices[i] === 48) && indices[i + 1] === 5) {
                output.setGraphicProperty(indices[i], {
                    class: `m${indices[i]}`,
                    style: `${indices[i] === 48 ? "background-" : ""}color:${ COLOR_8BIT[indices[i + 2]] }`
                });
                i += 2;
                continue;
            }
            output.setGraphicProperty(indices[i], {
                class: `m${indices[i]}`
            });
        }
    },
    "\x1b[({[\\w\\-]+})m": (args) => { // print element of class
        let cls = args[0];
        if (!cls)
            return;
        output.setGraphicProperty(9, { class: cls });
    },
    "\x1b!URL={[^\\x20]*} ({[^\\)]+})": ([url, text]) => {
        output.setGraphicProperty(9, {
            tag: "a",
            attrs: {
                href: url,
                target: "_blank"
            }
        });
        output.immediatePlainPrint(text);
        output.clearGraphicProperty(9);
    }
}