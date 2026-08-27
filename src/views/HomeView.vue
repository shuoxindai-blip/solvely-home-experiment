<template>
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
    <symbol id="i-home" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23zM20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23z"/></symbol>
    <symbol id="i-mic" viewBox="0 0 24 24"><rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></symbol>
    <symbol id="i-wand" viewBox="0 0 24 24"><path d="m15 4 5 5L8 21l-5-5zM6 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM18 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></symbol>
    <symbol id="i-exam" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 8h8M8 12h4M16 14l2 2M18 14l-2 2"/></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M18 14v8M14 18h8"/></symbol>
    <symbol id="i-edit" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/></symbol>
    <symbol id="i-cap" viewBox="0 0 24 24"><path d="m2 10 10-5 10 5-10 5zM6 12.5V17c3 2 9 2 12 0v-4.5M22 10v6"/></symbol>
    <symbol id="i-history" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></symbol>
    <symbol id="i-upload" viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></symbol>
    <symbol id="i-file" viewBox="0 0 24 24"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></symbol>
    <symbol id="i-image" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 3 3 2-2 6 6"/></symbol>
    <symbol id="i-spark" viewBox="0 0 24 24"><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></symbol>
    <symbol id="i-solver" viewBox="0 0 24 24"><path d="M4 5h16v14H4zM7 9h3M8.5 7.5v3M14 8l4 8M18 8l-4 8"/></symbol>
    <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></symbol>
    <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 16.5A9 9 0 0 1 7.5 4 8 8 0 1 0 20 16.5Z"/></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>
    <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V5M16 20v-8M22 20H2"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></symbol>
    <symbol id="i-atom" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v12H8l-4 4z"/><path d="M8 10h8M8 13h5"/></symbol>
    <symbol id="i-store" viewBox="0 0 24 24"><path d="M4 9v11h16V9M3 4h18l-2 5H5zM9 20v-6h6v6"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></symbol>
    <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/></symbol>
    <symbol id="i-youtube" viewBox="0 0 24 24"><path d="M21.2 7.2a2.8 2.8 0 0 0-2-2C17.4 4.7 12 4.7 12 4.7s-5.4 0-7.2.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.3 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.2.5 7.2.5s5.4 0 7.2-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.8 29 29 0 0 0-.5-4.8Z"/><path d="m10 9 5 3-5 3Z"/></symbol>
    <symbol id="i-game" viewBox="0 0 24 24"><path d="M7 8h10a5 5 0 0 1 4.6 6.9l-1.2 3a2.5 2.5 0 0 1-4.1.8L14.8 17H9.2l-1.5 1.7a2.5 2.5 0 0 1-4.1-.8l-1.2-3A5 5 0 0 1 7 8Z"/><path d="M7 12v4M5 14h4M16 13h.01M19 15h.01"/></symbol>
    <symbol id="i-calculator" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M7 5h10v4H7zM8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>
    <symbol id="i-crop" viewBox="0 0 24 24"><path d="M7 3v13a4 4 0 0 0 4 4h10M3 7h13a4 4 0 0 1 4 4v10"/></symbol>
  </svg>

  <div class="app" id="solvelyApp">
    <aside class="sidebar" aria-label="Primary navigation">
      <div class="brand-row">
        <div class="brand-mark" aria-hidden="true">
          <svg class="brand-logo" viewBox="0 0 52 52" role="img">
            <defs>
              <linearGradient id="brandSurface" x1="7" y1="5" x2="46" y2="49" gradientUnits="userSpaceOnUse">
                <stop stop-color="#073FE9"/>
                <stop offset=".55" stop-color="#2538EE"/>
                <stop offset="1" stop-color="#5833F4"/>
              </linearGradient>
              <linearGradient id="brandGlyph" x1="17" y1="18" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FFFFFF"/>
                <stop offset=".52" stop-color="#E9EEFF"/>
                <stop offset="1" stop-color="#FFFFFF"/>
              </linearGradient>
            </defs>
            <rect width="52" height="52" rx="11" fill="url(#brandSurface)"/>
            <path d="M12 21v-5.2c0-3.2 2.6-5.8 5.8-5.8H23M29 10h5.2c3.2 0 5.8 2.6 5.8 5.8V21M40 31v5.2c0 3.2-2.6 5.8-5.8 5.8H29M23 42h-5.2c-3.2 0-5.8-2.6-5.8-5.8V31" fill="none" stroke="#fff" stroke-width="2.15" stroke-linecap="round"/>
            <path d="M17.4 18.7c4.8-1.8 7 .8 9.2 7.2l2.3 6.5c1.1 3.2 3 3.7 6.1 1.4M34.6 19.2c-3.6-1.7-6 .7-8.1 4.8L23 31c-1.5 3-3.5 4.7-6.4 2.9" fill="none" stroke="url(#brandGlyph)" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="brand">Solvely.ai</div>
        <button class="sidebar-collapse" id="sidebarCollapse" aria-label="Collapse sidebar"><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="4.5" width="15" height="15" rx="2.5"/><path d="M9 5v14M14.5 8.5 11 12l3.5 3.5"/></svg></button>
      </div>

      <nav class="sidebar-nav">
        <button class="nav-button active" id="homeNav"><svg class="icon"><use href="#i-home"/></svg><span class="nav-label">Home</span></button>
        <button class="nav-button" data-toast="AI Study would open here"><svg class="icon"><use href="#i-book"/></svg><span class="nav-label">AI Study</span></button>
        <button class="nav-button" data-toast="AI Live Notes would open here"><svg class="icon"><use href="#i-mic"/></svg><span class="nav-label">AI Live Notes</span></button>
        <button class="nav-button" data-toast="AI Writing Tools would open here"><svg class="icon"><use href="#i-wand"/></svg><span class="nav-label">AI Writing Tools</span></button>
        <button class="nav-button" id="examPredictorNav"><svg class="icon"><use href="#i-exam"/></svg><span class="nav-label">Exam Predictor</span></button>
        <button class="nav-button" data-toast="Mini Games would open here"><svg class="icon"><use href="#i-game"/></svg><span class="nav-label">Mini Games</span></button>
        <button class="nav-button" data-toast="History page would open here" hidden aria-hidden="true"><svg class="icon"><use href="#i-history"/></svg><span class="nav-label">History</span></button>
      </nav>

      <div class="sidebar-spacer"></div>
      <div class="side-meta">
        <section class="app-download-card" aria-label="Download the Solvely app">
          <div class="app-store-links">
            <span class="app-store-entry">
              <a class="app-store-link apple-store" href="https://apps.apple.com/us/app/solvely-ai-study-tools/id6446930976" target="_blank" rel="noopener" aria-describedby="appDownloadQrTooltip" aria-label="Download Solvely on the App Store"><img src="/assets/download-on-app-store.svg" alt="Download on the App Store" width="96" height="32" /></a>
            </span>
            <span class="app-store-entry">
              <a class="app-store-link google-play" href="https://play.google.com/store/apps/details?id=com.solvely.photo.math.solver.calculator.ai" target="_blank" rel="noopener" aria-describedby="appDownloadQrTooltip" aria-label="Get Solvely on Google Play"><img src="/assets/get-it-on-google-play-trimmed.png" alt="Get it on Google Play" width="107" height="32" /></a>
            </span>
          </div>
          <span class="app-qr-popover" id="appDownloadQrTooltip" role="tooltip"><img src="/assets/solvely-mobile-qr.svg" alt="" width="132" height="132" /><small>Scan to download Solvely</small></span>
        </section>
        <button class="upgrade" data-toast="Upgrade flow opened"><span class="discount">57%<br>OFF</span><span class="upgrade-label">⬆ Upgrade</span></button>
        <div class="user-row">
          <div class="avatar"><svg class="icon icon-sm"><use href="#i-user"/></svg></div>
          <span class="user-name">Anna</span>
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode"><svg class="icon"><use href="#i-moon"/></svg></button>
        </div>
      </div>
    </aside>

    <main>
      <div class="extension-entry" id="extensionEntry" aria-label="Solvely browser extension">
        <a class="extension-cta" id="extensionCta" href="https://chromewebstore.google.com/detail/aedglnfjjccpifohekdeoogffomjcikm" target="_blank" rel="noopener" aria-describedby="extensionTooltip" aria-label="Get the Chrome Extension">
          <svg class="extension-browser-icon" id="extensionBrowserIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z"/></svg>
          <span id="extensionCtaLabel">Get the Chrome Extension</span>
          <span class="extension-tooltip" id="extensionTooltip" role="tooltip">Solve anywhere on the web</span>
        </a>
      </div>
      <button class="history-entry" id="historyEntry" type="button" aria-controls="historyDrawer" aria-expanded="false"><svg class="icon"><use href="#i-history"/></svg><span>History</span></button>
      <header class="topbar">
        <button class="mobile-menu" id="mobileMenu" aria-label="Open navigation"><svg class="icon"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
        <span class="topbar-title">AI learning workspace</span>
        <div class="topbar-actions">
          <button class="topbar-button" data-toast="2 recent chats">2 chats</button>
          <button class="topbar-button" data-toast="Invite and sharing options would open here">Share</button>
        </div>
      </header>

      <div class="workspace" id="homeWorkspace">
        <header class="hero">
          <h1>Solvely: Your AI Study Companion</h1>
          <div class="workspace-mode-switch" id="workspaceModeSwitch" role="tablist" aria-label="Choose workspace mode">
            <button class="workspace-mode-button" role="tab" aria-selected="true" data-workspace-mode="study"><svg class="icon"><use href="#i-book"/></svg><span>Study</span></button>
            <button class="workspace-mode-button" role="tab" aria-selected="false" data-workspace-mode="exam"><svg class="icon"><use href="#i-target"/></svg><span>Exam Prep</span></button>
            <button class="workspace-mode-button" role="tab" aria-selected="false" data-workspace-mode="writing"><svg class="icon"><use href="#i-wand"/></svg><span>Writing</span></button>
          </div>
        </header>

        <section class="composer-shell" id="composerShell" aria-label="Solvely learning composer">
          <div class="capability-strip" id="capabilityStrip" role="tablist" aria-label="Choose a learning capability"></div>

          <div class="composer-input-wrap">
            <textarea class="composer-input" id="promptInput" aria-label="Tell Solvely what you want to learn" placeholder="Type or paste a problem to solve"></textarea>
          </div>
          <div class="attachment-row" id="attachmentRow" role="list" aria-label="Attached sources"></div>
          <div class="writing-tool-options" id="writingToolOptions" hidden></div>
          <div class="composer-toolbar">
            <button class="tool-button" id="attachButton" aria-label="Attach files" title="Attach files"><svg class="icon"><use href="#i-upload"/></svg></button>
            <button class="tool-button" id="imageButton" aria-label="Upload images" title="Upload images"><svg class="icon"><use href="#i-image"/></svg></button>
            <button class="tool-button" id="linkButton" aria-label="Paste a study material link" aria-expanded="false" title="Paste link"><svg class="icon"><use href="#i-link"/></svg></button>
            <button class="tool-button phase-one-hidden" id="calculatorButton" aria-label="Open calculator" aria-expanded="false" title="Calculator"><svg class="icon"><use href="#i-calculator"/></svg></button>
            <span class="toolbar-spacer"></span>
            <button class="model-button" id="modelButton" aria-haspopup="menu" aria-expanded="false"><span class="brand-mini"><svg class="icon"><use href="#i-atom"/></svg></span><span id="modelLabel">Solvely AI</span><svg class="icon icon-sm"><use href="#i-chevron"/></svg></button>
            <button class="tool-button phase-one-hidden" id="voiceButton" aria-label="Voice input" aria-pressed="false" title="Voice input"><svg class="icon"><use href="#i-mic"/></svg></button>
            <output class="writing-word-count" id="writingWordCount" aria-label="Word count" hidden>0 words</output>
            <div class="citation-selectors" id="citationSelectors" aria-label="Citation settings" hidden>
              <div class="citation-dropdown">
                <button class="citation-selector-button" id="citationFormatButton" type="button" data-citation-trigger="format" aria-haspopup="menu" aria-expanded="false" aria-controls="citationFormatMenu"><span class="citation-selector-value" id="citationFormatLabel">APA 7th</span><svg class="icon"><use href="#i-chevron"/></svg></button>
                <div class="citation-dropdown-menu" id="citationFormatMenu" role="menu" aria-label="Citation format" hidden>
                  <p class="model-menu-title">Format</p>
                  <button class="model-option active" type="button" role="menuitemradio" aria-checked="true" data-citation-option="format" data-citation-value="APA 7th"><strong>APA 7th</strong></button>
                  <button class="model-option" type="button" role="menuitemradio" aria-checked="false" data-citation-option="format" data-citation-value="MLA"><strong>MLA</strong></button>
                  <button class="model-option" type="button" role="menuitemradio" aria-checked="false" data-citation-option="format" data-citation-value="Chicago"><strong>Chicago</strong></button>
                  <button class="model-option" type="button" role="menuitemradio" aria-checked="false" data-citation-option="format" data-citation-value="ASA"><strong>ASA</strong></button>
                  <button class="model-option" type="button" role="menuitemradio" aria-checked="false" data-citation-option="format" data-citation-value="IEEE"><strong>IEEE</strong></button>
                  <button class="model-option" type="button" role="menuitemradio" aria-checked="false" data-citation-option="format" data-citation-value="AMA"><strong>AMA</strong></button>
                  <button class="model-option" type="button" role="menuitemradio" aria-checked="false" data-citation-option="format" data-citation-value="Harvard"><strong>Harvard</strong></button>
                </div>
              </div>
              <div class="citation-dropdown">
                <button class="citation-selector-button" id="citationSourceTypeButton" type="button" data-citation-trigger="sourceType" aria-haspopup="menu" aria-expanded="false" aria-controls="citationSourceTypeMenu"><span class="citation-selector-value" id="citationSourceTypeLabel">Website</span><svg class="icon"><use href="#i-chevron"/></svg></button>
                <div class="citation-dropdown-menu" id="citationSourceTypeMenu" role="menu" aria-label="Citation source type" hidden>
                  <p class="model-menu-title">Source type</p>
                  <button class="model-option active" type="button" role="menuitemradio" aria-checked="true" data-citation-option="sourceType" data-citation-value="Website"><strong>Website</strong></button>
                  <button class="model-option" type="button" role="menuitemradio" aria-checked="false" data-citation-option="sourceType" data-citation-value="Book"><strong>Book</strong></button>
                  <button class="model-option" type="button" role="menuitemradio" aria-checked="false" data-citation-option="sourceType" data-citation-value="Journal Article"><strong>Journal Article</strong></button>
                </div>
              </div>
            </div>
            <button class="send-button" id="sendButton" disabled><svg class="icon"><use href="#i-spark"/></svg><span id="sendLabel">Ask</span></button>
          </div>

          <div class="popover" id="modelPopover" role="menu" hidden>
            <p class="model-menu-title">Solvely AI</p>
            <button class="model-option active" role="menuitem" data-model="Solvely AI"><span class="model-letter">S</span><span><strong>Solvely AI</strong><small>Instant answers, reliable results</small></span><span class="model-check">✓</span></button>
            <button class="model-option" role="menuitem" data-model="Multi-model"><span class="model-letter">M</span><span><strong>Multi-model</strong><small>Cross-checked for highest accuracy</small></span><span class="model-check"></span></button>
            <p class="model-menu-title">Third-Party Model</p>
            <button class="model-option" role="menuitem" data-model="GPT Pro"><span class="model-letter">G</span><span><strong>GPT Pro</strong><small>Strong in math and logic</small></span><span class="model-check"></span></button>
            <button class="model-option" role="menuitem" data-model="Gemini Pro"><span class="model-letter">G</span><span><strong>Gemini Pro</strong><small>Deep, insightful, cross-domain</small></span><span class="model-check"></span></button>
            <button class="model-option" role="menuitem" data-model="Claude Opus"><span class="model-letter">C</span><span><strong>Claude Opus</strong><small>Eloquent, thoughtful, linguist</small></span><span class="model-check"></span></button>
          </div>

          <div class="link-popover" id="linkPopover" hidden>
            <div class="link-popover-row"><input id="linkInput" type="url" inputmode="url" aria-label="Study material URL" placeholder="https://example.com/study-material" /><button id="addLinkButton" type="button">Add link</button></div>
            <p id="linkPopoverHelp">Public webpages, videos, and document links are supported.</p>
          </div>
          <div class="writing-composer-content" id="writingComposerContent">
            <div class="writing-text-screen" id="writingTextScreen" hidden>
              <section class="writing-text-panel" aria-labelledby="writingDraftTitle">
                <div class="writing-panel-head"><h2 id="writingDraftTitle">Original text</h2></div>
                <div class="writing-editor-wrap">
                  <textarea class="writing-editor" id="writingEditor" aria-label="Original text" placeholder="Paste AI-generated text here, upload a file, or try a sample"></textarea>
                  <div class="writing-inline-actions">
                    <button class="writing-inline-button" id="writingPasteButton" type="button"><svg class="icon"><use href="#i-file"/></svg><span>Paste</span></button>
                    <button class="writing-inline-button" id="writingSampleButton" type="button"><svg class="icon"><use href="#i-spark"/></svg><span>Try a sample</span></button>
                  </div>
                </div>
                <div class="writing-draft-footer">
                  <button class="writing-footer-upload" id="writingUploadButton" type="button" aria-label="Upload file" title="Upload file"><svg class="icon"><use href="#i-upload"/></svg></button>
                  <button class="writing-action-button" id="writingActionButton" type="button" disabled><svg class="icon"><use href="#i-spark"/></svg><span>Humanize</span></button>
                </div>
                <section class="writing-result-panel" id="writingResultPanel" aria-labelledby="writingResultTitle" hidden>
                  <h2 id="writingResultTitle">Result</h2>
                  <div class="writing-result-content" id="writingResultContent"></div>
                </section>
              </section>
            </div>
            <div class="research-tool-screen" id="researchToolScreen">
              <div class="research-entry">
                <div class="research-entry-card">
                  <textarea class="research-input" id="researchInput" aria-label="Research topic" placeholder="Enter your topic, research question, or assignment prompt to start searching for credible sources."></textarea>
                  <div class="research-entry-footer"><button class="writing-footer-upload" id="researchUploadButton" type="button" aria-label="Upload file" title="Upload file"><svg class="icon"><use href="#i-upload"/></svg></button><button class="research-action-button" id="researchActionButton" type="button" disabled><svg class="icon"><use href="#i-search"/></svg><span>Search</span></button></div>
                </div>
                <p class="research-samples-label">Or, try searching for:</p>
                <div class="research-samples">
                  <button class="research-sample-card" type="button" data-research-sample="Educational data science in higher education"><svg class="icon"><use href="#i-search"/></svg><strong>Topic</strong><span>Educational data science in higher education</span></button>
                  <button class="research-sample-card" type="button" data-research-sample="Write a literature review examining the relationship between social media use and student wellbeing."><svg class="icon"><use href="#i-book"/></svg><strong>Assignment</strong><span>Write a literature review examining the relationship...</span></button>
                  <button class="research-sample-card" type="button" data-research-sample="How does sleep paralysis affect mental wellbeing?"><svg class="icon"><use href="#i-chat"/></svg><strong>Question</strong><span>How does sleep paralysis affect mental wellbeing?</span></button>
                </div>
              </div>
              <section class="research-result" id="researchResult" aria-labelledby="researchResultTitle" hidden><h2 id="researchResultTitle">Research result</h2><div class="research-result-content" id="researchResultContent"></div></section>
            </div>
          </div>
          <input id="fileInput" type="file" multiple hidden />
          <input id="imageInput" type="file" accept="image/*" multiple hidden />
          <input id="writingFileInput" type="file" accept=".pdf,.doc,.docx,.txt,text/plain,application/pdf" hidden />
        </section>

        <section class="examples-section" aria-label="Examples">
          <div class="examples-heading" id="examplesHeading" hidden>
            <div class="examples-copy"><h2 id="examplesTitle" hidden></h2></div>
            <div class="multi-model-proof" id="multiModelProof" aria-label="Cross-check across AI models for highest accuracy" hidden>
              <div class="multi-model-logos" aria-hidden="true">
                <span class="multi-model-logo" title="ChatGPT">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.205 8.765v-2.26c0-.19.071-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.567 0 .166 0 .356-.024.547l-4.71-2.76a.8.8 0 0 0-.856 0zm10.609 8.801v-5.4c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.43.43 0 0 1 .476 0l4.544 2.617c1.308.761 2.188 2.378 2.188 3.948 0 1.808-1.07 3.473-2.76 4.163M7.802 12.809l-1.95-1.142c-.167-.095-.239-.238-.239-.428V6.006c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.174c-.285.166-.428.404-.428.737zM12 15.235l-2.795-1.57v-3.33L12 8.765l2.795 1.57v3.33zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472m-5.638-5.303-4.543-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.48 4.48 0 0 1 4.21 6.434v5.424c0 .333.143.57.428.737l5.947 3.449-1.95 1.118a.43.43 0 0 1-.477 0m-.261 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.711q.429.249.856 0l5.97-3.449v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.524-2.117.524m5.899 2.83a5.95 5.95 0 0 0 5.828-4.756c2.663-.69 4.376-3.188 4.376-5.733 0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.096-1.88.31A5.96 5.96 0 0 0 10.205.107a5.95 5.95 0 0 0-5.827 4.757C1.713 5.554 0 8.052 0 10.597c0 1.665.714 3.282 1.998 4.448-.119.5-.19.999-.19 1.498 0 3.401 2.759 5.947 5.946 5.947.642 0 1.26-.095 1.88-.31a5.96 5.96 0 0 0 4.162 1.713"/></svg>
                </span>
                <span class="multi-model-logo" title="Gemini">
                  <svg viewBox="0 0 28 28"><defs><radialGradient id="crossCheckGeminiGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.779 11.38) rotate(18.683) scale(29.803 238.737)"><stop offset=".067" stop-color="#9168C0"/><stop offset=".343" stop-color="#5684D1"/><stop offset=".672" stop-color="#1BA1E3"/></radialGradient></defs><path d="M14 28c0-1.937-.373-3.757-1.12-5.46a14 14 0 0 0-2.975-4.445A14 14 0 0 0 5.46 15.12C3.757 14.373 1.937 14 0 14c1.937 0 3.757-.362 5.46-1.085a14 14 0 0 0 4.445-3.01A14 14 0 0 0 12.88 5.46C13.627 3.757 14 1.937 14 0c0 1.937.362 3.757 1.085 5.46a14 14 0 0 0 3.01 4.445 14 14 0 0 0 4.445 3.01C24.243 13.638 26.063 14 28 14c-1.937 0-3.757.373-5.46 1.12a14 14 0 0 0-4.445 2.975 14 14 0 0 0-3.01 4.445C14.362 24.243 14 26.063 14 28Z" fill="url(#crossCheckGeminiGradient)"/></svg>
                </span>
                <span class="multi-model-logo" title="Claude">
                  <svg viewBox="0 0 24 24"><path fill="#d97757" d="M11.376 24 10.776 23.544 10.44 22.8 10.776 21.312 11.16 19.392 11.472 17.856 11.76 15.96 11.928 15.336 11.904 15.288 11.784 15.312 10.344 17.28 8.16 20.232 6.432 22.056 6.024 22.224 5.304 21.864 5.376 21.192 5.784 20.616 8.16 17.568 9.6 15.672 10.536 14.592 10.512 14.448 10.464 14.448 4.128 18.576 3 18.72 2.496 18.264 2.568 17.52 2.808 17.28 4.704 15.96 9.432 13.32 9.504 13.08 9.432 12.96 9.192 12.96 8.4 12.912 5.712 12.84 3.384 12.744 1.104 12.624.528 12.504 0 11.784.048 11.424.528 11.112 1.224 11.16 2.736 11.28 5.016 11.424 6.672 11.52 9.12 11.784 9.504 11.784 9.552 11.616 9.432 11.52 9.336 11.424 6.96 9.84 4.416 8.16 3.072 7.176 2.352 6.672 1.992 6.216 1.848 5.208 2.496 4.488 3.384 4.56 3.6 4.608 4.488 5.304 6.384 6.768 8.88 8.616 9.24 8.904 9.408 8.808 9.408 8.736 9.24 8.472 7.896 6.024 6.456 3.528 5.808 2.496 5.64 1.872 5.544 1.152 6.288.144 6.696 0 7.704.144 8.112.504 8.736 1.92 9.72 4.152 11.28 7.176 11.736 8.088 11.976 8.904 12.072 9.168 12.24 9.168 12.24 9.024 12.36 7.296 12.6 5.208 12.84 2.52 12.912 1.752 13.296.84 14.04.36 14.616.624 15.096 1.32 15.024 1.752 14.76 3.6 14.184 6.504 13.824 8.472 14.04 8.472 14.28 8.208 15.264 6.912 16.92 4.848 17.64 4.032 18.504 3.12 19.056 2.688 20.088 2.688 20.832 3.816 20.496 4.992 19.44 6.336 18.552 7.464 17.28 9.168 16.512 10.536 16.584 10.632 16.752 10.632 19.608 10.008 21.168 9.744 22.992 9.432 23.832 9.816 23.928 10.2 23.592 11.016 21.624 11.496 19.32 11.952 15.888 12.768 15.84 12.792 15.888 12.864 17.424 13.008 18.096 13.056 19.728 13.056 22.752 13.272 23.544 13.8 24 14.424 23.928 14.928 22.704 15.528 21.072 15.144 17.232 14.232 15.936 13.92 15.744 13.92 15.744 14.016 16.848 15.096 18.84 16.896 21.36 19.224 21.48 19.8 21.168 20.28 20.832 20.232 18.624 18.552 17.76 17.808 15.84 16.2 15.72 16.2 15.72 16.368 16.152 17.016 18.504 20.544 18.624 21.624 18.456 21.96 17.832 22.176 17.184 22.056 15.792 20.136 14.376 17.952 13.224 16.008 13.104 16.104 12.408 23.352 12.096 23.712Z"/></svg>
                </span>
                <span class="multi-model-logo solvely" title="Solvely AI">
                  <svg viewBox="0 0 52 52"><defs><linearGradient id="crossCheckSolvelySurface" x1="7" y1="5" x2="46" y2="49" gradientUnits="userSpaceOnUse"><stop stop-color="#073FE9"/><stop offset=".55" stop-color="#2538EE"/><stop offset="1" stop-color="#5833F4"/></linearGradient><linearGradient id="crossCheckSolvelyGlyph" x1="17" y1="18" x2="35" y2="35" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset=".52" stop-color="#E9EEFF"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="52" height="52" rx="11" fill="url(#crossCheckSolvelySurface)"/><path d="M12 21v-5.2c0-3.2 2.6-5.8 5.8-5.8H23M29 10h5.2c3.2 0 5.8 2.6 5.8 5.8V21M40 31v5.2c0 3.2-2.6 5.8-5.8 5.8H29M23 42h-5.2c-3.2 0-5.8-2.6-5.8-5.8V31" fill="none" stroke="#fff" stroke-width="2.15" stroke-linecap="round"/><path d="M17.4 18.7c4.8-1.8 7 .8 9.2 7.2l2.3 6.5c1.1 3.2 3 3.7 6.1 1.4M34.6 19.2c-3.6-1.7-6 .7-8.1 4.8L23 31c-1.5 3-3.5 4.7-6.4 2.9" fill="none" stroke="url(#crossCheckSolvelyGlyph)" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
              <p>Cross-check across AI models for <strong>highest accuracy</strong></p>
            </div>
            <p class="examples-description" id="examplesDescription"></p>
          </div>
          <div class="examples-grid" id="examplesGrid"></div>
        </section>
        <section class="exam-catalog" id="examCatalog" aria-labelledby="examCatalogTitle" hidden>
          <div class="exam-catalog-heading"><div><h2 id="examCatalogTitle">Standardized test courses</h2></div><p>Topic study, mock exams, results, and targeted improvement.</p></div>
          <section class="diagnostic-entry" aria-labelledby="diagnosticEntryTitle">
            <div class="diagnostic-entry-copy">
              <div class="diagnostic-entry-meta"><span>FREE DIAGNOSTIC</span><span>ABOUT 10 MIN</span></div>
              <h3 id="diagnosticEntryTitle">See where you stand and what to study next</h3>
              <p>Get your predicted score, pinpoint your weakest skills, and see exactly where to focus next.</p>
            </div>
            <button class="diagnostic-entry-button" id="diagnosticEntryButton" type="button">Start free diagnostic<svg class="icon"><use href="#i-chevron"/></svg></button>
          </section>
          <div class="exam-catalog-toolbar">
            <label class="exam-search-wrap"><svg class="icon"><use href="#i-search"/></svg><input id="examCourseSearch" aria-label="Search standardized exam courses" placeholder="Search SAT, ACT, AP, Abitur..." /></label>
            <label class="exam-filter-wrap"><span class="sr-only">Filter exam packages</span><select id="examCourseFilter" aria-label="Filter exam packages"><option value="all">All courses</option><option value="sat">SAT</option><option value="act">ACT</option><option value="ap">AP</option><option value="abitur">Abitur</option></select><svg class="icon"><use href="#i-chevron"/></svg></label>
          </div>
          <div class="course-grid" id="courseGrid" aria-label="Pre-made exam courses"></div>
          <p class="course-empty" id="courseEmpty" hidden>No matching courses. Try another exam name.</p>
        </section>
      </div>

      <section class="course-workspace" id="courseWorkspace" aria-labelledby="courseWorkspaceTitle" hidden>
        <button class="course-back" id="courseBackButton" type="button"><svg class="icon"><use href="#i-chevron"/></svg><span>Back to courses</span></button>
        <header class="course-package-hero">
          <div class="course-package-copy">
            <p class="course-package-breadcrumb"><span>Exam Prep</span><i></i><span id="courseWorkspaceFamily">Course</span></p>
            <h1 id="courseWorkspaceTitle">Exam preparation course</h1>
            <p id="courseWorkspaceDescription">A complete preparation path with focused lessons, adaptive practice, realistic exams, and score insights.</p>
            <div class="course-package-metrics" id="courseWorkspaceMetrics"></div>
          </div>
          <aside class="course-progress-summary" aria-label="Course progress">
            <div class="course-progress-summary-head"><span>Course progress</span><strong>18%</strong></div>
            <div class="course-progress-track" aria-label="18 percent complete"><i></i></div>
            <p>3 topics in progress · Next: continue Linear equations</p>
          </aside>
        </header>
        <nav class="course-package-tabs" id="coursePackageTabs" role="tablist" aria-label="Course sections">
          <button class="course-package-tab" type="button" role="tab" aria-selected="true" data-course-tab="overview">Overview</button>
          <button class="course-package-tab" type="button" role="tab" aria-selected="false" data-course-tab="study">Study Plan</button>
          <button class="course-package-tab" type="button" role="tab" aria-selected="false" data-course-tab="mock">Mock Exam</button>
          <button class="course-package-tab" type="button" role="tab" aria-selected="false" data-course-tab="results">Results &amp; Improve</button>
        </nav>
        <div class="course-package-panel" id="coursePackagePanel" role="tabpanel" aria-live="polite"></div>
      </section>

      <section class="exam-predictor-workspace" id="examPredictorWorkspace" aria-labelledby="examPredictorSampleTitle" hidden>
        <header class="predictor-page-header">
          <div>
            <p class="predictor-breadcrumb"><span>Exam Predictor</span><i></i><span>Exam Sets</span></p>
            <h1 id="examPredictorSampleTitle">BOLD 5042: 1 and 2 Chronicles Final Exam</h1>
            <div class="predictor-source-actions">
              <span><svg class="icon"><use href="#i-file"/></svg>Generated from 1 file</span>
              <button type="button" data-predictor-action="Share link copied"><svg class="icon"><use href="#i-link"/></svg>Share</button>
            </div>
          </div>
          <aside class="predictor-mastery" aria-label="3 percent mastery">
            <div class="predictor-mastery-ring"><strong>3%</strong></div>
            <span>Mastery</span>
            <div class="predictor-mastery-track"><i></i></div>
          </aside>
        </header>
        <div class="predictor-page-grid">
          <div class="predictor-main-column">
            <section class="predictor-section" aria-labelledby="predictorMockTitle">
              <h2 class="predictor-section-title" id="predictorMockTitle">Mock Exams</h2>
              <div class="predictor-mock-grid">
                <article class="predictor-mock-card">
                  <div class="predictor-mock-icon"><svg class="icon"><use href="#i-target"/></svg></div>
                  <h3>Mock Exam 1</h3>
                  <span class="predictor-likelihood">≥90% likely</span>
                  <p>The must-know questions. Nail these first</p>
                  <p class="predictor-mock-meta">34 mins · 25 Questions · Predicted likelihood: ≥90%</p>
                  <span class="predictor-mock-status">Not started</span>
                  <button class="predictor-primary-action" type="button" data-predictor-action="Mock Exam 1 opened">Start exam <span>→</span></button>
                </article>
                <article class="predictor-mock-card">
                  <div class="predictor-mock-icon"><svg class="icon"><use href="#i-spark"/></svg></div>
                  <h3>Mock Exam 2</h3>
                  <span class="predictor-likelihood mid">80–90% likely</span>
                  <p>Highly likely questions. Practice makes perfect</p>
                  <p class="predictor-mock-meta">42 mins · 25 Questions · Predicted likelihood: 80–90%</p>
                  <span class="predictor-mock-status">Not started</span>
                  <button class="predictor-primary-action" type="button" data-predictor-action="Mock Exam 2 opened">Start exam <span>→</span></button>
                </article>
              </div>
            </section>

            <section class="predictor-section predictor-topics-wrap" aria-labelledby="predictorTopicsTitle">
              <h2 class="predictor-section-title" id="predictorTopicsTitle">Predicted Exam Topics</h2>
              <div class="predictor-topics-scroll">
                <div class="predictor-topics-table" role="table" aria-label="Predicted exam topics">
                  <div class="predictor-topic-head" role="row"><span>Topic</span><span>Likelihood</span><span>Mastery</span></div>
                  <div id="predictorTopicsList"></div>
                </div>
              </div>
            </section>
          </div>

          <aside class="predictor-side-column">
            <section aria-labelledby="predictorCramTitle">
              <h2 class="predictor-section-title" id="predictorCramTitle">Cram Mode</h2>
              <article class="predictor-cram-card">
                <div class="predictor-cram-head">
                  <div><h3>Study Plan</h3><p>Exam: Jul. 24, 2026　·　2-day plan</p></div>
                  <button type="button" aria-label="Study plan settings" data-predictor-action="Study plan settings opened">⚙</button>
                </div>
                <div class="predictor-mini-calendar">
                  <div class="predictor-weekdays"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
                  <div class="predictor-calendar-days"><span>20</span><span>21</span><span class="study-day">22</span><span class="study-day">23</span><span class="exam-day">24</span><span>25</span><span>26</span></div>
                </div>
                <div class="predictor-day-task">
                  <div class="predictor-day-task-head"><span>Exam day</span><span>1 task</span></div>
                  <button class="predictor-task-button" type="button" aria-pressed="true" data-predictor-task><span class="predictor-task-check">✓</span><span>Cheat Sheet</span></button>
                </div>
              </article>
            </section>

            <section aria-labelledby="predictorCheatTitle">
              <h2 class="predictor-section-title" id="predictorCheatTitle">Cheat Sheet</h2>
              <article class="predictor-cheat-card">
                <div class="predictor-cheat-icon">▣</div>
                <h3>Cheat Sheet Editor</h3>
                <p>Key equations, definitions, and terms</p>
                <button class="predictor-dark-action" type="button" data-predictor-action="Cheat Sheet Editor opened">View　→</button>
              </article>
            </section>

            <section aria-labelledby="predictorRecallTitle">
              <h2 class="predictor-section-title" id="predictorRecallTitle">Quick Concept Recall</h2>
              <article class="predictor-recall-card">
                <div class="predictor-recall-top"><div class="predictor-recall-icon">◆</div><span class="predictor-recall-count">50 CARDS</span></div>
                <h3>Flashcards</h3>
                <p>Memorize all key concepts with spaced repetition</p>
                <button class="predictor-recall-action" type="button" data-predictor-action="Flashcards opened">Start　→</button>
              </article>
            </section>
          </aside>
        </div>
      </section>
    </main>
  </div>

  <section class="calculator-panel" id="calculatorPanel" aria-label="Calculator" hidden></section>

  <dialog class="example-dialog" id="exampleDialog">
    <div class="dialog-head">
      <div class="dialog-icon" id="dialogIcon"></div>
      <div class="dialog-head-copy"><span id="dialogKicker"></span><h2 id="dialogTitle"></h2><p id="dialogDescription"></p></div>
      <button class="dialog-close" id="dialogClose" aria-label="Close preview"><svg class="icon"><use href="#i-close"/></svg></button>
    </div>
    <div class="dialog-body"><div class="dialog-preview" id="dialogPreview"></div><div class="dialog-interaction" id="dialogInteraction"></div></div>
  </dialog>

  <dialog class="diagnostic-dialog" id="diagnosticDialog" aria-labelledby="diagnosticDialogTitle">
    <header class="diagnostic-dialog-head">
      <div class="diagnostic-dialog-icon" aria-hidden="true"><svg class="icon"><use href="#i-chart"/></svg></div>
      <div class="diagnostic-dialog-title"><span>Free · about 10 minutes</span><h2 id="diagnosticDialogTitle">Set up your diagnostic</h2><p>Three quick details help us benchmark your performance.</p></div>
      <button class="diagnostic-dialog-close" id="diagnosticDialogClose" type="button" aria-label="Close diagnostic setup"><svg class="icon"><use href="#i-close"/></svg></button>
    </header>
    <form class="diagnostic-setup" id="diagnosticSetupForm">
      <div class="diagnostic-setup-fields">
        <label class="diagnostic-field"><span>Which exam are you preparing for?</span><span class="diagnostic-field-select"><select id="diagnosticExam" required aria-label="Choose an exam"></select><svg class="icon"><use href="#i-chevron"/></svg></span></label>
        <label class="diagnostic-field"><span>What score are you aiming for?</span><span class="diagnostic-field-select"><select id="diagnosticTargetScore" required aria-label="Choose a target score"></select><svg class="icon"><use href="#i-chevron"/></svg></span></label>
        <label class="diagnostic-field"><span>When is your exam?</span><input id="diagnosticTestDate" type="date" required aria-label="Choose your test date" /></label>
        <p class="diagnostic-setup-note"><svg class="icon" aria-hidden="true"><use href="#i-target"/></svg><span>Your answers personalize the score estimate and study recommendations. No payment required.</span></p>
        <button class="diagnostic-continue" type="submit">Start my diagnostic</button>
      </div>
      <aside class="diagnostic-preview-pane" id="diagnosticPreviewPane" aria-label="Sample diagnostic report"></aside>
    </form>
    <section class="diagnostic-ready" id="diagnosticReady" aria-live="polite" hidden>
      <div class="diagnostic-ready-mark" aria-hidden="true"><svg class="icon"><use href="#i-target"/></svg></div>
      <h3 id="diagnosticReadyTitle">Your diagnostic is ready</h3>
      <p>Answer 10 adaptive questions to get a predicted score and a focused study plan.</p>
      <div class="diagnostic-ready-summary"><div><span>Exam</span><strong id="diagnosticReadyExam"></strong></div><div><span>Goal</span><strong id="diagnosticReadyScore"></strong></div><div><span>Test date</span><strong id="diagnosticReadyDate"></strong></div></div>
      <div class="diagnostic-ready-benefits"><span>Predicted score</span><span>Weakest skills</span><span>What to study next</span></div>
      <button class="diagnostic-start" id="diagnosticStart" type="button">Start 10-min diagnostic</button>
      <button class="diagnostic-edit" id="diagnosticEdit" type="button">Edit details</button>
    </section>
  </dialog>

  <dialog class="crop-dialog" id="cropDialog" aria-labelledby="cropDialogTitle">
    <div class="crop-dialog-head">
      <h2 id="cropDialogTitle">Crop Image</h2>
      <button class="crop-dialog-close" id="cropDialogClose" type="button" aria-label="Close crop editor"><svg class="icon"><use href="#i-close"/></svg></button>
    </div>
    <div class="crop-stage" id="cropStage">
      <div class="crop-image-frame" id="cropImageFrame">
        <img class="crop-editor-image" id="cropEditorImage" alt="Image being cropped" />
        <div class="crop-selection" id="cropSelection" aria-label="Crop selection">
          <i class="crop-handle" data-crop-handle="nw"></i><i class="crop-handle" data-crop-handle="n"></i><i class="crop-handle" data-crop-handle="ne"></i><i class="crop-handle" data-crop-handle="e"></i><i class="crop-handle" data-crop-handle="se"></i><i class="crop-handle" data-crop-handle="s"></i><i class="crop-handle" data-crop-handle="sw"></i><i class="crop-handle" data-crop-handle="w"></i>
        </div>
      </div>
    </div>
    <div class="crop-dialog-footer">
      <div class="crop-thumbnails" id="cropThumbnails" aria-label="Uploaded images"></div>
      <button class="crop-done" id="cropDone" type="button">Done</button>
    </div>
  </dialog>

  <button class="history-backdrop" id="historyBackdrop" type="button" aria-label="Close history"></button>
  <aside class="history-drawer" id="historyDrawer" aria-labelledby="historyDrawerTitle" aria-hidden="true" inert>
    <header class="history-drawer-head">
      <div><h2 id="historyDrawerTitle">History</h2><p>Continue where you left off</p></div>
      <button class="history-drawer-close" id="historyDrawerClose" type="button" aria-label="Close history"><svg class="icon"><use href="#i-close"/></svg></button>
    </header>
    <div class="history-drawer-body">
      <section class="history-group" aria-labelledby="historyTodayTitle">
        <h3 class="history-group-title" id="historyTodayTitle">Today</h3>
        <button class="history-item" type="button" data-recent-capability="solver" data-recent-prompt="Solve x² − 5x + 6 = 0 and explain each step."><span class="history-item-icon"><svg class="icon"><use href="#i-solver"/></svg></span><span class="history-item-copy"><strong>Quadratic equation roots</strong><span>Solver</span></span><time>10:42</time></button>
        <button class="history-item" type="button" data-recent-capability="mock" data-recent-prompt="Create a focused SAT exam prep plan for the next four weeks."><span class="history-item-icon"><svg class="icon"><use href="#i-target"/></svg></span><span class="history-item-copy"><strong>SAT practice plan</strong><span>Exam Prep</span></span><time>09:18</time></button>
      </section>
      <section class="history-group" aria-labelledby="historyWeekTitle">
        <h3 class="history-group-title" id="historyWeekTitle">Previous 7 days</h3>
        <button class="history-item" type="button" data-recent-capability="quiz" data-recent-prompt="Create a quiz on cell biology from my uploaded notes."><span class="history-item-icon"><svg class="icon"><use href="#i-exam"/></svg></span><span class="history-item-copy"><strong>Cell biology quiz</strong><span>Quiz</span></span><time>Mon</time></button>
        <button class="history-item" type="button" data-recent-capability="flashcards" data-recent-prompt="Create organic chemistry flashcards from my study material."><span class="history-item-icon"><svg class="icon"><use href="#i-grid"/></svg></span><span class="history-item-copy"><strong>Organic chemistry review</strong><span>Flashcards</span></span><time>Sun</time></button>
        <button class="history-item" type="button" data-recent-capability="podcast" data-recent-prompt="Create a conversational podcast about the French Revolution."><span class="history-item-icon"><svg class="icon"><use href="#i-mic"/></svg></span><span class="history-item-copy"><strong>The French Revolution</strong><span>Podcast</span></span><time>Fri</time></button>
      </section>
    </div>
  </aside>

  <button class="chat-button" id="chatButton" aria-label="Open support chat"><svg class="icon"><use href="#i-chat"/></svg></button>
  <div class="sr-only" id="workspaceStatus" role="status" aria-live="polite" aria-atomic="true"></div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { initHomeExperience } from '../features/home/initHomeExperience'
import { useWorkspaceStore } from '../stores/workspace'

const workspaceStore = useWorkspaceStore()
let disposeExperience

onMounted(() => {
  workspaceStore.markRuntimeReady()
  disposeExperience = initHomeExperience({ onWorkspaceChange:workspaceStore.setActiveWorkspace })
})

onBeforeUnmount(() => disposeExperience?.())
</script>

<style src="../styles/home.less" lang="less"></style>
