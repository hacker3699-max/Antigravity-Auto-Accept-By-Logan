# Antigravity Auto-Accept By Logan (로건봇)

Antigravity(VS Code 기반) 에디터에서 발생하는 다양한 수락/허용/실행 버튼을 자동으로 클릭해주는 스마트 매크로 확장 프로그램입니다.

---

## 🇰🇷 한국어 가이드 (Korean)

### 1. 프로젝트 소개
로건봇은 AI 페어 프로그래밍 중 발생하는 반복적인 수락 절차([Accept], [Allow], [Run] 등)를 자동화하여 개발 흐름이 끊기지 않게 돕습니다. CDP(Chrome DevTools Protocol) 기술을 사용하여 에디터의 렌더러 프로세스에 보이지 않는 매크로를 주입하는 방식으로 작동합니다.

### 2. 핵심 기능
- **스마트 타겟팅**: 텍스트뿐만 아니라 `aria-label`, `title`, 그리고 **파란색 배경의 버튼**을 시각적으로 분석하여 정확하게 수락 버튼만 골라냅니다.
- **안전 구역 보호**: 사이드바, 액티비티 바 등의 메뉴는 건드리지 않고 알림창, 대화상자, 편집창 내의 버튼만 공략합니다.
- **실시간 토글**: 하단 상태바의 아이콘(🚀 START / ✅ ON)을 통해 언제든 기능을 켜고 끌 수 있습니다.

### 3. 설치 및 셋팅 방법
1. 이 레포지토리를 다운로드(Clone)합니다.
2. 폴더 내에서 의존성을 설치합니다:
   ```bash
   npm install
   ```
3. **[중요] Antigravity 실행 옵션 설정**:
   로건봇이 에디터를 조종하기 위해서는 반드시 **9222 포트**가 열려있어야 합니다. 터미널에서 다음과 같이 실행하세요:
   ```bash
   open -a /Applications/Antigravity.app --args --remote-debugging-port=9222
   ```

### 4. 사용 방법
1. 에디터를 실행한 후 하단 상태바의 **🚀 START** 버튼을 클릭합니다.
2. 버튼이 **✅ ON**으로 바뀌면 모든 준비가 끝났습니다.
3. 이제 AI의 제안이나 시스템 알림이 오면 로건봇이 자동으로 수락합니다.

---

## 🇺🇸 English Guide

### 1. Introduction
Logan Bot is a smart macro extension for the Antigravity editor (based on VS Code) that automatically clicks confirmation buttons like [Accept], [Allow], and [Run]. It injects a runtime macro into the editor's renderer process using the Chrome DevTools Protocol (CDP) via port 9222.

### 2. Key Features
- **Smart Targeting**: Analyzes text, `aria-label`, `title`, and even **visual patterns (Blue buttons)** to precisely identify accept buttons.
- **Safety Zones**: Protects critical UI elements like sidebars and activity bars while focusing on notifications, dialogs, and editor overlays.
- **Real-time Toggle**: Activate/Deactivate instantly using the Status Bar icon (🚀 START / ✅ ON).

### 3. Installation & Setup
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. **[CRITICAL] Launch Options**:
   Antigravity must be launched with the debugging port enabled for the bot to function:
   ```bash
   open -a /Applications/Antigravity.app --args --remote-debugging-port=9222
   ```

### 4. How to Use
1. After launching the editor, click the **🚀 START** button in the status bar.
2. Once it toggles to **✅ ON**, the bot is active.
3. The bot will now automatically handle proposals and permission requests for you.

---

## 🛠 Tech Stack
- **Engine**: Node.js, VS Code Extension API
- **Bridge**: Chrome DevTools Protocol (CDP)
- **Communication**: WebSocket (ws)

Created with 🚀 by Logan.
