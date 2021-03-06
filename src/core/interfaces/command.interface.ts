import { Context } from "telegraf";

export interface Command {
  /**
   * Command callback function
   * @param context Command context
   */
  run(context: Context): Promise<void>;
}