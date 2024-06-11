# dyLcore Update
*dyLcore is a code structure I use to program the bots (AutoResponse and the other)*

## Changes/Updates
* Now supporting DM messaging and DM commands.

## Commands:
* Added the replyCooldowns database to keep track of which channels are on a cooldown. If you want to add a cooldown to a channel, simply run ` /pausereplies {channel} {length} `. To remove a cooldown, run ` /resumereplies {channel} `.
* Fixed some permissions on the following commands:
 * ` /clearmessages ` require the user to have the ` Administrator ` role permission. *` /restart ` and ` /me ` show up for ` Administrator `, but can only be used by the bot owner haha.*
 * ` /user ` and the other ` User Commands ` now require the ` Manage Members ` role permission.

## Current Issues:
* If messaging AutoResponse through a DM, there are settings for it: Reply Channels, Channel Chances, and Trusted Roles (*which is deprecated*).
* If a message is deleted from a non-reply channel, AutoResponse cannot find a chance, which produces an error.

## Future Changes/Updates:
* When the ` userUpdate ` event is called, the output needs to be changed.
* Will add an option to opt in to events. For example, if someone changes their avatar, the bot will send an alert to that channel.
* Will add the ability to download media from YouTube, Soundcloud, and other platforms.

### [GitHub](https://github.com/notdyLn/AutoResponse)
