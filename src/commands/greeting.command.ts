import { Context } from "telegraf";
import { Command } from "../core/interfaces/command.interface";
import * as strings from "./strings.json";

export class GreetingCommand implements Command {
  async run(context: Context): Promise<void> {
    const min = Math.ceil(0);
    const max = Math.floor(strings.greeting.greeting.length);
    const number = Math.floor(Math.random() * (max - min + 1)) + min;

    const message = strings.greeting.greeting[number];

    if (message) {
      context.reply(
        message.replace(
          "${message.from.first_name}",
          context.message.from.first_name
        )
      );
    } else {
      context.reply("Eae");
    }
  }
}
