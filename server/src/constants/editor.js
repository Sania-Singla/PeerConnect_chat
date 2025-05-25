const LANGUAGE_CONFIG = {
    python3: { versionIndex: '3' },
    java: { versionIndex: '3' },
    cpp: { versionIndex: '4' },
    nodejs: { versionIndex: '3' },
    c: { versionIndex: '4' },
    ruby: { versionIndex: '3' },
    go: { versionIndex: '3' },
    scala: { versionIndex: '3' },
    bash: { versionIndex: '3' },
    sql: { versionIndex: '3' },
    pascal: { versionIndex: '2' },
    csharp: { versionIndex: '3' },
    php: { versionIndex: '3' },
    swift: { versionIndex: '3' },
    rust: { versionIndex: '3' },
    r: { versionIndex: '3' },
};

const ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    SYNC_CODE: 'sync-code',
    LEAVE: 'leave',
};

export { LANGUAGE_CONFIG, ACTIONS };
