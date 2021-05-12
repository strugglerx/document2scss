import * as vscode from "vscode";
import * as toast from "./util/toast";
import { parseUtil } from "./util/parse";

class logic{
    constructor(){

    }
    async html2scss() {
        var editor = vscode.window.activeTextEditor;
        var filetypes = ['html', 'htm', 'jsp', 'php', 'vue', 'jsx', 'tsx', 'wxml', 'javascriptreact', 'typescriptreact'];
        if (!editor) {
            return toast.alert("errcode:001");
        }
        if (editor.selection.isEmpty) {
            return toast.alert("you may not select any xml like code");
        }
        if (filetypes.indexOf(editor.document.languageId) == -1) {
            return toast.alert(`you may not select any xml like code,\nsupprot filetype ${filetypes.map(i => '*.' + i).join(' ')}`);
        }
        var codetext = editor.document.getText(editor.selection).trim();
        let code = new parseUtil(codetext).toscss();
        const file = editor.document.uri.fsPath.replace(/\.\w+$/, '.scss');
        const setting = vscode.Uri.parse('untitled:' + file);
        vscode.workspace.openTextDocument(setting).then((a) => {
            vscode.window.showTextDocument(a, 1, false)
                .then(e => {
                    e.edit(edit => {
                        /**
                         * If its an untitled file, then we will insert the ES6 after 2 line breaks in same file.
                         */
                        if (file.includes('Untitled')) {
                            edit.insert(new vscode.Position(0, 0), `\n \n ${code}`);
                        }
                        else {
                            // Otherwise create a new file with `name_es6.js` and paste the code.
                            edit.insert(new vscode.Position(0, 0), code);
                        }
                    });
                });
        }, (error) => {
            // if we errors, log it. No need to show.
            console.error(error);
        });
        // var doc1 = yield vscode.window.showTextDocument(doc);
        // console.log(doc1);
        toast.warn(`file:${editor.document.uri.fsPath + ".scss"} is created`);
    }
}

export default logic;