import http from 'http';
import { BrowserWindow, ipcMain } from 'electron';
import PromptManager from "./electron-prompts/src/index";
import { PromptTemplate } from "./electron-prompts/src/types";

const prompts = new PromptManager({ width: 400 });

const serverUrl = 'http://127.0.0.1:3000';

interface PokeParams {
    groupUin: string;
    userUin: string;
}

interface SpecialTitleParams {
    groupUin: string;
    userUid: string;
}

function sendHttpRequest(url: string, data: object): Promise<any> {
    return new Promise((resolve, reject) => {
        const req = http.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            }
        }, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

ipcMain.handle('llqqnt_pp_poke', async (event: any, { groupUin, userUin }: PokeParams) => {
    console.log('llqqnt_pp_poke called', userUin, groupUin);
    try {
        const url = groupUin ? `${serverUrl}/group_poke` : `${serverUrl}/friend_poke`;
        const data = {
            user_id: userUin,
            ...(groupUin && { group_id: groupUin }), // 如果有 groupUin 则包含 group_id
        };
        const response = await sendHttpRequest(url, data);
        console.log('Poke response:', response);
    } catch (e) {
        console.log('llqqnt_pp_poke error', e);
    }
});

ipcMain.handle('llqqnt_pp_setSpecialTitle', async (event: any, { groupUin, userUid }: SpecialTitleParams) => {
    const pTemplate: PromptTemplate = {
        windowTitle: "",
        cancelButton: {
            classes: ["btn", "btn-secondary"],
        },
        elements: [
            {
                type: "header",
                value: "设置头衔",
            },
            {
                type: "input",
                name: "title",
                placeholder: "请输入群头衔",
                value: "",
                classes: ["form-control"],
            },
        ],
        buttons: [
            {
                name: "submit",
                value: "确定",
                classes: ["btn", "btn-primary"],
            },
        ],
    }

    const title = (await prompts.spawn(pTemplate))?.values.title;

    console.log('llqqnt_pp_setSpecialTitle called', groupUin, userUid, title);
    try {
        // 如果 title 为空，表示移除群头衔
        const response = await sendHttpRequest(`${serverUrl}/set_group_special_title`, {
            group_id: groupUin,
            user_id: userUid,
            special_title: title || "", // 空字符串表示去掉头衔
        });
        console.log('Set title response:', response);
    } catch (e) {
        console.log('llqqnt_pp_setSpecialTitle error', e);
    }
});

export function onBrowserWindowCreated(window: BrowserWindow) {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((window) => {
        if (!window.isDestroyed()) {
            window.webContents.send('llqqnt_pp_create_window', { windowId: window.id });
        }
    });
}
