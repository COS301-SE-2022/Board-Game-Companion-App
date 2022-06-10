import { helpModule } from './scripts/files/dc1c7f9a-7f95-40c7-bcc7-e04f9a63f560/main.module';
import { ScriptExecutorModule } from './scripts/files/0292181a-8499-47d5-82ea-0da9bacf8ed3/main.module';import { TicTacToeModule } from './scripts/files/dbee8955-4349-412f-9739-931fc3a5c7dd/main.module';
import { DefaultModule } from './scripts/files/6a93bfab-db39-44d2-bcdb-008b0e01be96/main.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [CommonModule ,DefaultModule ,TicTacToeModule ,ScriptExecutorModule ,TicTacToeModule ,helpModule],
})
export class UploadsModule {}