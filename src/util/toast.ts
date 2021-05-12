import * as vscode from "vscode";

export let warn = (obj:string) => {
    vscode.window.showInformationMessage(obj);
};

export let alert = (obj: string) => {
    vscode.window.showErrorMessage(`${obj}`, { modal: true });
};