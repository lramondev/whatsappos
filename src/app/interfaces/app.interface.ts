import { Module } from './module.interface';
import { Settings } from './settings.interface';

export interface App {
  name: string;
  version: string;
  modules: Module[];
  settings: Settings;
}