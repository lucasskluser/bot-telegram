import { GreetingCommand } from "./commands/greeting.command";
import { App } from "./core/app";
import { config as loadEnv } from "dotenv";
loadEnv();

const app: App = new App({
  telegramToken: process.env["TELEGRAM_TOKEN"]!,
  witToken: process.env["WITAI_TOKEN"]!,
  commands: [new GreetingCommand()],
});

app.start();
