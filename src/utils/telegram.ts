// Тестовый только локалхост, так как игры только на проде, нужен внешний доступ к ним
const TEST_BOT_URL = "https://kolesa-conf-bot-cmn-kube.kolesa-team.org/external";
const PROD_BOT_URL = "/ms/conf-bot";

interface SetGameScoreParams {
    messageId: string;
    chatId: string;
    userId: string;
    gameScore: number;
    gameName: string;
    isTestBot: number;
}

export function setGameScore({
    messageId,
    chatId,
    userId,
    gameScore,
    gameName,
    isTestBot,
}: SetGameScoreParams) {
    const data = {
        user_id: parseInt(userId),
        score: gameScore,
        message_id: parseInt(messageId),
        chat_id: parseInt(chatId),
        game_name: gameName,
    };

    const isTest = parseInt(isTestBot.toString()) === 1;
    const baseUrl = isTest ? TEST_BOT_URL : PROD_BOT_URL;

    return fetch(
        `${baseUrl}/setUserScore`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            ...(!isTest && { mode: "cors" }),
        }
    ).catch(error => {
        console.error('Fetch error:', error);
        throw error;
    }).then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to set game score');
        }
        return response;
    });
}

