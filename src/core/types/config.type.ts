import { Command } from "../interfaces/command.interface";

export class Config {
  constructor(partial: Partial<Config>) {
    this.telegramToken = "";
    this.witToken = "";
    this.onlyMentions = false;
    this.commands = [];

    Object.assign(this, partial);
  }

  telegramToken: string;
  witToken: string;
  onlyMentions: boolean;
  commands: Command[];
}
