import { jest } from '@jest/globals';
import { automataScriptStub } from '../stubs/automata-scriptStub';
import { AutomataScriptDocumentStub } from '../stubs/automatascript-docStub';
import { downloadscriptStub } from '../stubs/dowload.stub';


export const automataService = jest.fn().mockReturnValue({
    getAll: jest.fn().mockReturnValue(automataScriptStub()),
    getByGame: jest.fn().mockReturnValue(automataScriptStub()),
    download: jest.fn().mockReturnValue(downloadscriptStub()),
    getOldVersions: jest.fn().mockReturnValue(downloadscriptStub()),
    getAutomataScript: jest.fn().mockReturnValue(AutomataScriptDocumentStub()),
   // addComment: jest.fn().mockReturnValue(downloadscriptStub()),
    getScriptById: jest.fn().mockReturnValue(automataScriptStub()),
    // remove: jest.fn().mockReturnValue(downloadscriptStub()),
    checkVersion: jest.fn().mockReturnValue(true),
    checkForUpdatesForOne: jest.fn().mockReturnValue("This is a string example")
})
    
