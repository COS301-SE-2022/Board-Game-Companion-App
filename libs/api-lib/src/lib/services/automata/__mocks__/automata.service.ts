//import {expect, jest, test} from '@jest/globals';

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
    
