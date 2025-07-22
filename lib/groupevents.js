//Give Me Credit If Using This File Give Me Credit On Your Channel ✅ 
// Credits Dev JON-SNOW - SNOW-MD💜 
const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363400596152474@newsletter',
            newsletterName: 'SNOW-MD',
            serverMessageId: 143,
        },
    };
};

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png'
];

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup || !update.participants || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const desc = metadata.desc || "No Description";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

        for (const num of update.participants) {
            const userName = num ? num.split("@")[0] : "Unknown";
            const timestamp = new Date().toLocaleString();
            const demoter = update.author ? update.author.split("@")[0] : "Unknown";

            const sudoList = config.SUDO?.map(s => s.trim()) || [];
            const isSudo = update.author ? sudoList.includes(update.author.split("@")[0]) : false;

            if (update.action === "add" && config.WELCOME === "true") {
                const text = `╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮
┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @${userName} 👋
┃𝙳𝙴𝚅: JON-SNOW
┃𝙽𝚄𝙼𝙱𝙴𝚁: #${groupMembersCount}
┃𝚃𝙸𝙼𝙴: ${timestamp}
╰━━━━━━━━━━━━━━━╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙎𝙉𝙊𝙒-𝙈𝘿*`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: text,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "remove" && config.WELCOME === "true") {
                const text = `╭╼━≪•𝙼𝙴𝙼𝙱𝙴𝚁 𝙻𝙴𝙵𝚃•≫━╾╮
┃𝙶𝙾𝙾𝙳𝙱𝚈𝙴: @${userName} 👋
┃𝙳𝙴𝚅: JON-SNOW
┃𝙽𝚄𝙼𝙱𝙴𝚁: #${groupMembersCount}
┃𝚃𝙸𝙼𝙴: ${timestamp}
╰━━━━━━━━━━━━━━━━╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙎𝙉𝙊𝙒-𝙈𝘿*`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: text,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                if (!isSudo) {
                    await conn.groupParticipantsUpdate(update.id, [update.author], 'remove');
                    await conn.sendMessage(update.id, {
                        text: `🚫 *UNAUTHORIZED DEMOTE ATTEMPT!*
👤 Target: @${userName}
👑 By: @${demoter}
❌ User has been *KICKED* for unauthorized demotion.
🔐 Only *SUDO* can manage admin privileges.`,
                        mentions: [update.author, num],
                        contextInfo: getContextInfo({ sender: update.author }),
                    });
                    return;
                }

                await conn.sendMessage(update.id, {
                    text: `📉 *USER DEMOTED*
👤 @${userName}
😔 By: @${demoter}
🕒 Time: ${timestamp}`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                if (!isSudo) {
                    await conn.groupParticipantsUpdate(update.id, [update.author], 'remove');
                    await conn.sendMessage(update.id, {
                        text: `🚫 *UNAUTHORIZED PROMOTE ATTEMPT!*
👤 Target: @${userName}
👑 By: @${demoter}
❌ User has been *KICKED* for unauthorized promotion.
🔐 Only *SUDO* can manage admin privileges.`,
                        mentions: [update.author, num],
                        contextInfo: getContextInfo({ sender: update.author }),
                    });
                    return;
                }

                await conn.sendMessage(update.id, {
                    text: `📈 *USER PROMOTED*
👤 @${userName}
✅ By: @${demoter}
🕒 Time: ${timestamp}`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('❌ Group event error:', err);
    }
};

module.exports = GroupEvents;
