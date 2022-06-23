'use strict';

import * as vscode from 'vscode';

// Detect ini-style sections and register them as folding ranges.
export class IniSectionFoldingRangeProvider implements vscode.FoldingRangeProvider {
    onDidChangeFoldingRanges?: vscode.Event<void> | undefined;
    provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
        let foldingRanges: vscode.FoldingRange[] = [];

        let sectionRegex: RegExp = /^\[[^\]]+\]/;
        let lastIdx: number = -1; // Last index where the section name was found
        let endEmptyLines: number = 0; // empty line counter

        for (let i = 0; i < document.lineCount; i++) {
            const textline: vscode.TextLine = document.lineAt(i);
            const line: string = textline.text.trim();
            if (line.match(sectionRegex)) {
                if (lastIdx == -1) {
                    lastIdx = i;
                } else {
                    foldingRanges.push(new vscode.FoldingRange(lastIdx, i - 1 - endEmptyLines, vscode.FoldingRangeKind.Region));
                    // Reset line states
                    lastIdx = i;
                }
                endEmptyLines = 0;
            } else if (line.length == 0) {
                endEmptyLines += 1;
            } else {
                // Reset empty line counter
                endEmptyLines = 0;
            }
        }
        
        if (lastIdx != -1) {
            foldingRanges.push(new vscode.FoldingRange(lastIdx, document.lineCount - 1 - endEmptyLines, vscode.FoldingRangeKind.Region));
        }

        return foldingRanges;
    }
    
}