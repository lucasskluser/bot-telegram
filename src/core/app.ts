import { Context, Telegraf } from "telegraf";
import { MessageResponse, Wit } from "node-wit";
import { ConfigError } from "./errors/config.error";
import { Command } from "./interfaces/command.interface";
import { Config } from "./types/config.type";

export class App {
  private readonly config: Config;
  private readonly telegraf: Telegraf;
  private readonly wit: Wit;
  private readonly commands: Map<string, Command>;

  constructor(config: Partial<Config>) {
    this.config = new Config(config);

    if (!this.config.telegramToken) {
      throw new ConfigError("The Telegram bot token must be provided");
    }

    if (!this.config.witToken) {
      throw new ConfigError("The Wit.AI token must be provided");
    }

    this.telegraf = new Telegraf(this.config.telegramToken);
    this.wit = new Wit({
      accessToken: this.config.witToken,
    });

    this.commands = new Map<string, Command>();

    if (this.config.commands) {
      for (const command of this.config.commands) {
        this.addCommand(command);
      }
    }

    process.once("SIGINT", () => this.telegraf.stop("SIGINT"));
    process.once("SIGTERM", () => this.telegraf.stop("SIGTERM"));
  }

  start(): void {
    this.telegraf.on("message", (context: Context) => this.onMessage(context));
    this.telegraf.launch();
    console.log('Bot iniciado');
  }

  addCommand(command: Command) {
    this.commands.set(
      command.constructor.name.toLowerCase().replace("command", ""),
      command
    );
  }

  private async onMessage(context: Context): Promise<void> {
    const message = context.message;

    if (message && "text" in message) {
      if (this.config.onlyMentions && this.telegraf.botInfo) {
        if (!message.text.includes(this.telegraf.botInfo.username)) {
          return;
        }
      }

      const witResponse: MessageResponse = await this.wit.message(
        message.text,
        {}
      );

      if (witResponse.intents && witResponse.intents.length > 0) {
        const orderedIntents = witResponse.intents.sort(
          (a, b) => a.confidence - b.confidence
        );
        const command = this.commands.get(orderedIntents[0].name.toLowerCase());

        if (command) {
          try {
            command.run(context);
          } catch (error) {
            context.reply("Af, deu pane aqui");
          }
        }
      }
    }
  }
}
