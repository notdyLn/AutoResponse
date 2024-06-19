# dyLcore Update
*dyLcore is basically a structure that the bots use*
## Commands / Events:
* Added the replyCooldowns database to keep track of which channels are on a cooldown. If you have the ` Manage Channels ` permission, you can run the ` /pausereplies {channel} {length} ` and ` /unpausereplies {channel} ` to add/remove a cooldown.
* The ` /clearmessages ` command now require the user to have the ` Administrator ` permission by default. *` /restart ` and ` /me ` also show up, but can only be ran by me.*
* ` /user ` and other User Commands now require the ` Manage Members ` role permission by default.
* Updated the ` messageCreate `, ` messageDelete `, and the ` messageUpdate ` events to output any Polls and Embeds attached to the message. *Embeds are still in the works, but those still detect it.*
* Added the ` messagePollVoteAdd ` and the ` messagePollVoteRemove ` events to show what vote was added by what user and the totaling amount of votes. *The ID is the only output for the user ATM*.
* The bots now support Direct Messages! This is a test feature I'm working on, and will give more updates later.
## Fixes:
* Fixed an issue where AutoResponse couldn't find the chance for a non-reply channel.
## Current Issues:
* When messaging AutoResponse through a DM, settings are automatically created and acts like a guild.
## Future Updates:
* Will add an option to opt in to event messages. For example, if a user updates their avatar or username, the bot will send an alert to a specific channel, with given details about the change.
* Will add a command to download media from YouTube, SoundCloud, and other platforms. *I've already tested this*.

[Source Code](https://github.com/notdyLn/AutoResponse/)
