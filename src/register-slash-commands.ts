import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CommandSlashManager } from "./commands/CommandSlashManager";
import { configuration } from "./configuration";

export async function registerSlashCommands(
  rest: REST,
  csm: CommandSlashManager,
  guildsId?: string[]
): Promise<void> {
  if (guildsId && guildsId.length >= 0) {
    await registerSlashCommandsForGuilds(rest, csm, guildsId);
  } else {
    await registerSlashCommandsForAllGuilds(rest, csm);
  }
}

async function registerSlashCommandsForAllGuilds(
  rest: REST,
  csm: CommandSlashManager
): Promise<void> {
  await rest.put(
    Routes.applicationCommands(configuration.discord.applicationId),
    {
      body: csm.getCommandsJSON(),
    }
  );
  console.log("Successfully reloaded application (/) commands for all guilds.");
}

async function registerSlashCommandsForGuilds(
  rest: REST,
  csm: CommandSlashManager,
  guildsId: string[]
): Promise<void> {
  for (const guildId of guildsId) {
    await rest.put(
      Routes.applicationGuildCommands(
        configuration.discord.applicationId,
        guildId
      ),
      {
        body: csm.getCommandsJSON(),
      }
    );
    console.log(
      `Successfully reloaded application (/) commands for guilds : ${guildId}.`
    );
  }
}
