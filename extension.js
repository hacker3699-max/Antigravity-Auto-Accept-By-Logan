const vscode = require('vscode');
const WebSocket = require('ws');
const http = require('http');

let activeSocket = null;
let statusBarItem;
let currentState = 'START';

function activate(context) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusBarItem.command = "logan-bot.toggle";
    updateStatusBar();
    statusBarItem.show();

    const toggleCmd = vscode.commands.registerCommand('logan-bot.toggle', async () => {
        if (currentState === 'START') await startMacro();
        else if (currentState === 'ON') await stopMacro();
    });

    context.subscriptions.push(statusBarItem, toggleCmd);
}

function updateStatusBar() {
    switch (currentState) {
        case 'START': statusBarItem.text = `$(rocket) START`; break;
        case 'ON': statusBarItem.text = `$(check) ON`; break;
        case 'STOP':
            statusBarItem.text = `$(primitive-square) STOP`;
            setTimeout(() => { currentState = 'START'; updateStatusBar(); }, 2000);
            break;
    }
}

async function startMacro() {
    try {
        const pageData = await getEditorPageData();
        if (!pageData) throw new Error('9222 포트 연결 실패');

        const socket = new WebSocket(pageData.webSocketDebuggerUrl);
        socket.on('open', () => {
            const macroCode = `
                if (window.myTimer) clearInterval(window.myTimer);
                console.log("%c[LoganBot] 로건봇 매크로가 실행되었습니다. (V2)", "color: #00ff00; font-weight: bold;");
                window.myTimer = setInterval(() => {
                    const ts = document.querySelectorAll("button, [role='button'], .monaco-button, a, .btn");
                    ts.forEach(el => {
                        if (el.closest('.quick-input-widget') || el.closest('.sidebar') || el.closest('.activitybar')) return;

                        const style = window.getComputedStyle(el);
                        const txt = (el.textContent || "").trim().toLowerCase();
                        const aria = (el.ariaLabel || "").trim().toLowerCase();
                        const title = (el.title || "").trim().toLowerCase();
                        

                        // 2. 허용 키워드
                        const keywords = ["accept all", "accept", "accept changes", "allow", "apply"];
                        const isKeywordMatched = keywords.some(k => 
                            txt === k || aria === k || (txt.includes(k) && txt.length < 15)
                        );

                        if (!isKeywordMatched) return;

                        // 3. 필터링 및 클릭 (가시성 및 중복 방지)
                        if (el.offsetWidth > 0 && !txt.includes('logan')) {
                            console.log("%c[LoganBot] Click Target Found:", "color: #3498db;", txt || aria || "No Text", el);
                            el.click();
                        }
                    });
                }, 1000);
            `;
            socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: macroCode } }));
            currentState = 'ON';
            updateStatusBar();
            socket.close();
        });
    } catch (err) {
        vscode.window.showErrorMessage("로건봇: 9222 포트가 닫혀 있습니다.");
    }
}

async function stopMacro() {
    try {
        const pageData = await getEditorPageData();
        if (pageData) {
            const stopSocket = new WebSocket(pageData.webSocketDebuggerUrl);
            stopSocket.on('open', () => {
                stopSocket.send(JSON.stringify({ id: 2, method: 'Runtime.evaluate', params: { expression: "clearInterval(window.myTimer);" } }));
                stopSocket.close();
            });
        }
    } catch (e) { }
    currentState = 'STOP';
    updateStatusBar();
}

function getEditorPageData() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:9222/json', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const pages = JSON.parse(data);
                    const workbench = pages.find(p => p.url && p.url.includes('workbench.html'));
                    resolve(workbench);
                } catch (e) { resolve(null); }
            });
        });
        req.on('error', () => resolve(null));
        req.end();
    });
}

exports.activate = activate;
