'use strict';
import * as vscode from 'vscode';
import { window, commands, TextDocument, Selection, Range, Position } from 'vscode';
import characterSetsToTabOutFrom from './charactersToTabOutFrom';
import { getPreviousChar, getNextChar } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const jumpout = commands.registerCommand('extension.jumpout', (e) => {
        const editor = window.activeTextEditor;
        if (!editor) {
            return;
        }
        const currentLineText = editor.document.lineAt(editor.selection.active.line).text;
        const currentPositionInLine = editor.selection.active.character;
        function executeDefault() {
            const editor = window.activeTextEditor;
            editor.edit(function (edit) {
                edit.insert(new Position(editor.selection.active.line, editor.selection.active.character), ';');
            });
        }
        function cursorRight() {
            commands.executeCommand("cursorRight");
        } 
        if (currentPositionInLine > 0) {
            const previousCharacter = getPreviousChar(currentPositionInLine, currentLineText);
            const nextCharacter = getNextChar(currentPositionInLine, currentLineText);
            const characterInfo = characterSetsToTabOutFrom.find(item => item.close === nextCharacter);
            if (characterInfo) {
                cursorRight();
            } else {
                executeDefault();
            }
        } else {
            executeDefault();
        }
    });
    context.subscriptions.push(jumpout);
}

// this method is called when your extension is deactivated
export function deactivate() {
}