const testBaseUrl = "https://kolesa-conf-bot-cmn-kube.kolesa-team.org/external"
const prodBasrUrl = "/ms/conf-bot"

// Функция для определения хоста
function getBotUrl() {
    const urlParams = new URLSearchParams(window.location.search.replace(/\\u0026/gm, "&"));
    const isTestBot = parseInt(urlParams.get("isTestBot")) === 1;

    return isTestBot ? testBaseUrl : prodBasrUrl;
}

export function setGameScore({
                                 messageId,
                                 chatId,
                                 userId,
                                 gameScore,
                                 gameName,
                                 isTestBot,
                             }) {
    const urlParams = new URLSearchParams(window.location.search.replace(/\\u0026/gm, "&"));
    const botName = urlParams.get("botName") || "kolesa-conf";
    const isTest = parseInt(isTestBot) === 1;
    const url = getBotUrl()

    const data = {
        user_id: parseInt(userId),
        score: gameScore,
        message_id: parseInt(messageId),
        chat_id: parseInt(chatId),
        game_name: gameName,
        bot_name: botName
    };

    return fetch(
        `${url}/setUserScore`,
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

export async function getGameScore({
                                       gameName,
                                       chatId,
                                       userId,
                                       isTestBot,
                                   }) {
    const urlParams = new URLSearchParams(window.location.search.replace(/\\u0026/gm, "&"));
    const botName = urlParams.get("botName") || "kolesa-conf";
    const isTest = parseInt(isTestBot) === 1;
    const url = getBotUrl()

    const data = {
        user_id: parseInt(userId),
        game_name: gameName,
        chat_id: chatId,
        isTestBot: isTestBot,
        bot_name: botName
    };

    return fetch(
        `${url}/getUserScore?` + new URLSearchParams(data),
        {
            method: "GET",
            ...(!isTest && { mode: "cors" }),
        }
    ).catch(error => {
        console.error('Fetch error:', error);
        throw error;
    }).then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to get game score');
        }
        return response.json();
    });
}

// example of usage
// function sendGameResult(coinsEarned) {
//     const queryString = window.location.search;
//     const normalize = queryString.replace(/\\u0026/gm, "&");
//     const urlParams = new URLSearchParams(normalize);
//     const userId = urlParams.get("userId");
//     const chatId = urlParams.get("chatId");
//     const gameName = "memory";
//     const messageId = urlParams.get("messageId");
//     const isTestBot = urlParams.get("isTestBot");
//     const botName = urlParams.get("botName") || "kolesa-conf";
//
//     setGameScore({
//         userId: userId,
//         chatId: chatId,
//         messageId: messageId,
//         isTestBot: isTestBot,
//         gameScore: coinsEarned,
//         gameName: gameName,
//         botName: botName
//     });
// };

// checkPreviousResults = function (callback) {
//     const modalEl = document.querySelector("#feedback-modal");
//     const params = getUrlParams();
//     globalGameState.isCheckingDatabase = true;
//
//     if (!params.userId || !params.chatId) {
//         globalGameState.hasCheckedDatabase = true;
//         globalGameState.isCheckingDatabase = false;
//         callback();
//         return;
//     }
//
//     getGameScore({
//         gameName: 'memory',
//         chatId: params.chatId,
//         userId: params.userId,
//         isTestBot: params.isTestBot,
//     })
//         .then((data) => {
//             globalGameState.hasCheckedDatabase = true;
//             globalGameState.isCheckingDatabase = false;
//
//             const normalized = normalizeScore(data?.score);
//
//             if (normalized === null) {
//                 globalGameState.canEarnCoins = true;
//                 globalGameState.isRepeatPlay = false;
//                 callback();
//                 return;
//             }
//
//             globalGameState.canEarnCoins = false;
//             globalGameState.isRepeatPlay = true;
//
//             if (gameState.isGameActive && this.timer?.stop) {
//                 this.timer.stop();
//             }
//
//             if (modalEl) modalEl.classList.add("bg-black");
//             this.showFeedBackModal({ type: "already", score: normalized });
//         })
//         .catch((error) => {
//             console.warn('Ошибка проверки предыдущих результатов:', error);
//             globalGameState.hasCheckedDatabase = true;
//             globalGameState.isCheckingDatabase = false;
//             globalGameState.canEarnCoins = true;
//             globalGameState.isRepeatPlay = false;
//             callback();
//         });
// };