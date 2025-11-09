// Comprehensive translations for PokerMind - 10+ languages

export type Language = 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ru' | 'ar' | 'ko' | 'hi';

export const languages: Record<Language, { name: string; flag: string; rtl?: boolean }> = {
  en: { name: 'English', flag: '🇬🇧' },
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Português', flag: '🇵🇹' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  ar: { name: 'العربية', flag: '🇸🇦', rtl: true },
  ko: { name: '한국어', flag: '🇰🇷' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
};

export const translations = {
  en: {
    // Common
    back: 'Back',
    continue: 'Continue',
    cancel: 'Cancel',
    loading: 'Loading',
    error: 'Error',
    success: 'Success',

    // Home
    home: 'Home',
    backToHome: 'Back to Home',

    // Lobby
    gameLobby: 'Game Lobby',
    soloVsAI: 'Solo vs AI',
    multiplayer: 'Multiplayer',
    playAgainstAI: 'Play against AI opponents and improve your skills',
    continueToSoloLobby: 'Continue to Solo Lobby',

    // Multiplayer
    quickMatch: 'Quick Match',
    browseTables: 'Browse Tables',
    connecting: 'Connecting to multiplayer server...',
    connectionError: 'Unable to connect to multiplayer server',
    retryConnection: 'Retry Connection',

    // Quick Match
    stakes: 'Stakes',
    micro: 'Micro',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    buyIn: 'Buy-in',
    buyInAmount: 'Buy-in: {amount} chips',
    findMatch: 'Find Match',

    // Searching
    searchingForPlayers: 'Searching for players...',
    cancelSearch: 'Cancel Search',
    matchmakingTip: 'Tip: Matchmaking usually takes 10-30 seconds',

    // Tables
    availableTables: 'Available Tables',
    refresh: 'Refresh',
    noTables: 'No tables available',
    tryQuickMatch: 'Try Quick Match instead!',
    blinds: 'Blinds',
    players: 'Players',
    joinTable: 'Join Table',
    full: 'Full',

    // Game
    multiplayerTable: 'Multiplayer Table',
    playersOnline: 'players online',
    leaveTable: 'Leave Table',
    yourTurn: 'YOUR TURN',
    waitingFor: 'Waiting for {player}...',

    // Actions
    fold: 'Fold',
    check: 'Check',
    call: 'Call',
    raise: 'Raise',
    bet: 'Bet',
    allIn: 'All-In',

    // Winner
    winner: 'Winner!',
    handComplete: 'Hand Complete',
    won: 'Won',
    chips: 'chips',

    // Loading
    connectingToTable: 'Connecting to Table',
    shufflingDeck: 'Shuffling the deck...',

    // Chat
    chat: 'Chat',
    typeMessage: 'Type a message...',
    send: 'Send',

    // Poker terms
    pot: 'POT',
    hand: 'Hand #',
    street: 'Street',
    dealer: 'Dealer',
    you: 'You',

    // Notifications
    playerJoined: '{player} joined the table',
    playerLeft: 'A player left the table',
    notEnoughChips: 'You need at least {amount} chips to play.',
    confirmLeave: 'Are you sure you want to leave the table?',
  },

  fr: {
    // Commun
    back: 'Retour',
    continue: 'Continuer',
    cancel: 'Annuler',
    loading: 'Chargement',
    error: 'Erreur',
    success: 'Succès',

    // Accueil
    home: 'Accueil',
    backToHome: 'Retour à l\'accueil',

    // Lobby
    gameLobby: 'Salon de Jeu',
    soloVsAI: 'Solo vs IA',
    multiplayer: 'Multijoueur',
    playAgainstAI: 'Jouez contre des adversaires IA et améliorez vos compétences',
    continueToSoloLobby: 'Continuer vers le Lobby Solo',

    // Multijoueur
    quickMatch: 'Match Rapide',
    browseTables: 'Parcourir les Tables',
    connecting: 'Connexion au serveur multijoueur...',
    connectionError: 'Impossible de se connecter au serveur multijoueur',
    retryConnection: 'Réessayer la Connexion',

    // Match Rapide
    stakes: 'Mises',
    micro: 'Micro',
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    buyIn: 'Buy-in',
    buyInAmount: 'Buy-in: {amount} jetons',
    findMatch: 'Trouver un Match',

    // Recherche
    searchingForPlayers: 'Recherche de joueurs...',
    cancelSearch: 'Annuler la Recherche',
    matchmakingTip: 'Astuce: Le matchmaking prend généralement 10-30 secondes',

    // Tables
    availableTables: 'Tables Disponibles',
    refresh: 'Actualiser',
    noTables: 'Aucune table disponible',
    tryQuickMatch: 'Essayez le Match Rapide!',
    blinds: 'Blindes',
    players: 'Joueurs',
    joinTable: 'Rejoindre',
    full: 'Complet',

    // Jeu
    multiplayerTable: 'Table Multijoueur',
    playersOnline: 'joueurs en ligne',
    leaveTable: 'Quitter la Table',
    yourTurn: 'VOTRE TOUR',
    waitingFor: 'En attente de {player}...',

    // Actions
    fold: 'Se Coucher',
    check: 'Parole',
    call: 'Suivre',
    raise: 'Relancer',
    bet: 'Miser',
    allIn: 'Tapis',

    // Gagnant
    winner: 'Gagnant!',
    handComplete: 'Main Terminée',
    won: 'Gagné',
    chips: 'jetons',

    // Chargement
    connectingToTable: 'Connexion à la Table',
    shufflingDeck: 'Mélange du paquet...',

    // Chat
    chat: 'Chat',
    typeMessage: 'Tapez un message...',
    send: 'Envoyer',

    // Termes poker
    pot: 'POT',
    hand: 'Main #',
    street: 'Tour',
    dealer: 'Donneur',
    you: 'Vous',

    // Notifications
    playerJoined: '{player} a rejoint la table',
    playerLeft: 'Un joueur a quitté la table',
    notEnoughChips: 'Vous avez besoin d\'au moins {amount} jetons pour jouer.',
    confirmLeave: 'Êtes-vous sûr de vouloir quitter la table?',
  },

  es: {
    // Común
    back: 'Volver',
    continue: 'Continuar',
    cancel: 'Cancelar',
    loading: 'Cargando',
    error: 'Error',
    success: 'Éxito',

    // Inicio
    home: 'Inicio',
    backToHome: 'Volver al Inicio',

    // Lobby
    gameLobby: 'Sala de Juego',
    soloVsAI: 'Solo vs IA',
    multiplayer: 'Multijugador',
    playAgainstAI: 'Juega contra oponentes IA y mejora tus habilidades',
    continueToSoloLobby: 'Continuar al Lobby Solo',

    // Multijugador
    quickMatch: 'Partida Rápida',
    browseTables: 'Explorar Mesas',
    connecting: 'Conectando al servidor multijugador...',
    connectionError: 'No se puede conectar al servidor multijugador',
    retryConnection: 'Reintentar Conexión',

    // Partida Rápida
    stakes: 'Apuestas',
    micro: 'Micro',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    buyIn: 'Buy-in',
    buyInAmount: 'Buy-in: {amount} fichas',
    findMatch: 'Buscar Partida',

    // Búsqueda
    searchingForPlayers: 'Buscando jugadores...',
    cancelSearch: 'Cancelar Búsqueda',
    matchmakingTip: 'Consejo: El emparejamiento suele tardar 10-30 segundos',

    // Mesas
    availableTables: 'Mesas Disponibles',
    refresh: 'Actualizar',
    noTables: 'No hay mesas disponibles',
    tryQuickMatch: '¡Prueba Partida Rápida!',
    blinds: 'Ciegas',
    players: 'Jugadores',
    joinTable: 'Unirse',
    full: 'Llena',

    // Juego
    multiplayerTable: 'Mesa Multijugador',
    playersOnline: 'jugadores en línea',
    leaveTable: 'Salir de la Mesa',
    yourTurn: 'TU TURNO',
    waitingFor: 'Esperando a {player}...',

    // Acciones
    fold: 'Retirarse',
    check: 'Pasar',
    call: 'Igualar',
    raise: 'Subir',
    bet: 'Apostar',
    allIn: 'All-In',

    // Ganador
    winner: '¡Ganador!',
    handComplete: 'Mano Completa',
    won: 'Ganó',
    chips: 'fichas',

    // Carga
    connectingToTable: 'Conectando a la Mesa',
    shufflingDeck: 'Barajando las cartas...',

    // Chat
    chat: 'Chat',
    typeMessage: 'Escribe un mensaje...',
    send: 'Enviar',

    // Términos poker
    pot: 'BOTE',
    hand: 'Mano #',
    street: 'Calle',
    dealer: 'Repartidor',
    you: 'Tú',

    // Notificaciones
    playerJoined: '{player} se unió a la mesa',
    playerLeft: 'Un jugador dejó la mesa',
    notEnoughChips: 'Necesitas al menos {amount} fichas para jugar.',
    confirmLeave: '¿Estás seguro de que quieres salir de la mesa?',
  },

  de: {
    // Allgemein
    back: 'Zurück',
    continue: 'Weiter',
    cancel: 'Abbrechen',
    loading: 'Laden',
    error: 'Fehler',
    success: 'Erfolg',

    // Startseite
    home: 'Startseite',
    backToHome: 'Zurück zur Startseite',

    // Lobby
    gameLobby: 'Spiellobby',
    soloVsAI: 'Solo vs KI',
    multiplayer: 'Mehrspieler',
    playAgainstAI: 'Spiele gegen KI-Gegner und verbessere deine Fähigkeiten',
    continueToSoloLobby: 'Weiter zur Solo-Lobby',

    // Mehrspieler
    quickMatch: 'Schnelles Spiel',
    browseTables: 'Tische Durchsuchen',
    connecting: 'Verbindung zum Mehrspieler-Server...',
    connectionError: 'Verbindung zum Mehrspieler-Server nicht möglich',
    retryConnection: 'Verbindung Wiederholen',

    // Schnelles Spiel
    stakes: 'Einsätze',
    micro: 'Mikro',
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
    buyIn: 'Buy-in',
    buyInAmount: 'Buy-in: {amount} Chips',
    findMatch: 'Spiel Finden',

    // Suche
    searchingForPlayers: 'Suche nach Spielern...',
    cancelSearch: 'Suche Abbrechen',
    matchmakingTip: 'Tipp: Matchmaking dauert normalerweise 10-30 Sekunden',

    // Tische
    availableTables: 'Verfügbare Tische',
    refresh: 'Aktualisieren',
    noTables: 'Keine Tische verfügbar',
    tryQuickMatch: 'Versuche Schnelles Spiel!',
    blinds: 'Blinds',
    players: 'Spieler',
    joinTable: 'Beitreten',
    full: 'Voll',

    // Spiel
    multiplayerTable: 'Mehrspieler-Tisch',
    playersOnline: 'Spieler online',
    leaveTable: 'Tisch Verlassen',
    yourTurn: 'DEIN ZUG',
    waitingFor: 'Warte auf {player}...',

    // Aktionen
    fold: 'Aussteigen',
    check: 'Schieben',
    call: 'Mitgehen',
    raise: 'Erhöhen',
    bet: 'Setzen',
    allIn: 'All-In',

    // Gewinner
    winner: 'Gewinner!',
    handComplete: 'Hand Beendet',
    won: 'Gewonnen',
    chips: 'Chips',

    // Laden
    connectingToTable: 'Verbindung zum Tisch',
    shufflingDeck: 'Karten werden gemischt...',

    // Chat
    chat: 'Chat',
    typeMessage: 'Nachricht eingeben...',
    send: 'Senden',

    // Poker-Begriffe
    pot: 'POTT',
    hand: 'Hand #',
    street: 'Straße',
    dealer: 'Geber',
    you: 'Du',

    // Benachrichtigungen
    playerJoined: '{player} ist dem Tisch beigetreten',
    playerLeft: 'Ein Spieler hat den Tisch verlassen',
    notEnoughChips: 'Du brauchst mindestens {amount} Chips zum Spielen.',
    confirmLeave: 'Bist du sicher, dass du den Tisch verlassen möchtest?',
  },

  it: {
    // Comune
    back: 'Indietro',
    continue: 'Continua',
    cancel: 'Annulla',
    loading: 'Caricamento',
    error: 'Errore',
    success: 'Successo',

    // Home
    home: 'Home',
    backToHome: 'Torna alla Home',

    // Lobby
    gameLobby: 'Sala Giochi',
    soloVsAI: 'Solo vs IA',
    multiplayer: 'Multigiocatore',
    playAgainstAI: 'Gioca contro avversari IA e migliora le tue abilità',
    continueToSoloLobby: 'Continua alla Lobby Solo',

    // Multigiocatore
    quickMatch: 'Partita Veloce',
    browseTables: 'Sfoglia Tavoli',
    connecting: 'Connessione al server multigiocatore...',
    connectionError: 'Impossibile connettersi al server multigiocatore',
    retryConnection: 'Riprova Connessione',

    // Partita Veloce
    stakes: 'Puntate',
    micro: 'Micro',
    low: 'Basso',
    medium: 'Medio',
    high: 'Alto',
    buyIn: 'Buy-in',
    buyInAmount: 'Buy-in: {amount} fiches',
    findMatch: 'Trova Partita',

    // Ricerca
    searchingForPlayers: 'Ricerca giocatori...',
    cancelSearch: 'Annulla Ricerca',
    matchmakingTip: 'Suggerimento: Il matchmaking richiede di solito 10-30 secondi',

    // Tavoli
    availableTables: 'Tavoli Disponibili',
    refresh: 'Aggiorna',
    noTables: 'Nessun tavolo disponibile',
    tryQuickMatch: 'Prova Partita Veloce!',
    blinds: 'Bui',
    players: 'Giocatori',
    joinTable: 'Unisciti',
    full: 'Pieno',

    // Gioco
    multiplayerTable: 'Tavolo Multigiocatore',
    playersOnline: 'giocatori online',
    leaveTable: 'Lascia Tavolo',
    yourTurn: 'TUO TURNO',
    waitingFor: 'In attesa di {player}...',

    // Azioni
    fold: 'Abbandona',
    check: 'Parola',
    call: 'Chiama',
    raise: 'Rilancia',
    bet: 'Punta',
    allIn: 'All-In',

    // Vincitore
    winner: 'Vincitore!',
    handComplete: 'Mano Completata',
    won: 'Vinto',
    chips: 'fiches',

    // Caricamento
    connectingToTable: 'Connessione al Tavolo',
    shufflingDeck: 'Mescolamento del mazzo...',

    // Chat
    chat: 'Chat',
    typeMessage: 'Scrivi un messaggio...',
    send: 'Invia',

    // Termini poker
    pot: 'PIATTO',
    hand: 'Mano #',
    street: 'Via',
    dealer: 'Mazziere',
    you: 'Tu',

    // Notifiche
    playerJoined: '{player} si è unito al tavolo',
    playerLeft: 'Un giocatore ha lasciato il tavolo',
    notEnoughChips: 'Hai bisogno di almeno {amount} fiches per giocare.',
    confirmLeave: 'Sei sicuro di voler lasciare il tavolo?',
  },

  pt: {
    // Comum
    back: 'Voltar',
    continue: 'Continuar',
    cancel: 'Cancelar',
    loading: 'Carregando',
    error: 'Erro',
    success: 'Sucesso',

    // Início
    home: 'Início',
    backToHome: 'Voltar ao Início',

    // Lobby
    gameLobby: 'Sala de Jogos',
    soloVsAI: 'Solo vs IA',
    multiplayer: 'Multijogador',
    playAgainstAI: 'Jogue contra adversários IA e melhore suas habilidades',
    continueToSoloLobby: 'Continuar para o Lobby Solo',

    // Multijogador
    quickMatch: 'Partida Rápida',
    browseTables: 'Procurar Mesas',
    connecting: 'Conectando ao servidor multijogador...',
    connectionError: 'Não foi possível conectar ao servidor multijogador',
    retryConnection: 'Tentar Conexão Novamente',

    // Partida Rápida
    stakes: 'Apostas',
    micro: 'Micro',
    low: 'Baixo',
    medium: 'Médio',
    high: 'Alto',
    buyIn: 'Buy-in',
    buyInAmount: 'Buy-in: {amount} fichas',
    findMatch: 'Encontrar Partida',

    // Pesquisa
    searchingForPlayers: 'Procurando jogadores...',
    cancelSearch: 'Cancelar Pesquisa',
    matchmakingTip: 'Dica: O emparelhamento geralmente leva 10-30 segundos',

    // Mesas
    availableTables: 'Mesas Disponíveis',
    refresh: 'Atualizar',
    noTables: 'Nenhuma mesa disponível',
    tryQuickMatch: 'Tente Partida Rápida!',
    blinds: 'Blinds',
    players: 'Jogadores',
    joinTable: 'Entrar',
    full: 'Cheia',

    // Jogo
    multiplayerTable: 'Mesa Multijogador',
    playersOnline: 'jogadores online',
    leaveTable: 'Sair da Mesa',
    yourTurn: 'SUA VEZ',
    waitingFor: 'Aguardando {player}...',

    // Ações
    fold: 'Desistir',
    check: 'Passar',
    call: 'Pagar',
    raise: 'Aumentar',
    bet: 'Apostar',
    allIn: 'All-In',

    // Vencedor
    winner: 'Vencedor!',
    handComplete: 'Mão Completa',
    won: 'Ganhou',
    chips: 'fichas',

    // Carregamento
    connectingToTable: 'Conectando à Mesa',
    shufflingDeck: 'Embaralhando as cartas...',

    // Chat
    chat: 'Chat',
    typeMessage: 'Digite uma mensagem...',
    send: 'Enviar',

    // Termos poker
    pot: 'POTE',
    hand: 'Mão #',
    street: 'Rua',
    dealer: 'Dealer',
    you: 'Você',

    // Notificações
    playerJoined: '{player} entrou na mesa',
    playerLeft: 'Um jogador saiu da mesa',
    notEnoughChips: 'Você precisa de pelo menos {amount} fichas para jogar.',
    confirmLeave: 'Tem certeza de que deseja sair da mesa?',
  },

  zh: {
    // 通用
    back: '返回',
    continue: '继续',
    cancel: '取消',
    loading: '加载中',
    error: '错误',
    success: '成功',

    // 首页
    home: '首页',
    backToHome: '返回首页',

    // 大厅
    gameLobby: '游戏大厅',
    soloVsAI: '单人对战AI',
    multiplayer: '多人游戏',
    playAgainstAI: '与AI对手对战并提升技能',
    continueToSoloLobby: '前往单人大厅',

    // 多人游戏
    quickMatch: '快速匹配',
    browseTables: '浏览牌桌',
    connecting: '正在连接多人游戏服务器...',
    connectionError: '无法连接到多人游戏服务器',
    retryConnection: '重试连接',

    // 快速匹配
    stakes: '赌注',
    micro: '微型',
    low: '低',
    medium: '中',
    high: '高',
    buyIn: '买入',
    buyInAmount: '买入: {amount} 筹码',
    findMatch: '寻找对局',

    // 搜索
    searchingForPlayers: '正在寻找玩家...',
    cancelSearch: '取消搜索',
    matchmakingTip: '提示: 匹配通常需要10-30秒',

    // 牌桌
    availableTables: '可用牌桌',
    refresh: '刷新',
    noTables: '没有可用的牌桌',
    tryQuickMatch: '试试快速匹配!',
    blinds: '盲注',
    players: '玩家',
    joinTable: '加入',
    full: '已满',

    // 游戏
    multiplayerTable: '多人牌桌',
    playersOnline: '在线玩家',
    leaveTable: '离开牌桌',
    yourTurn: '轮到你了',
    waitingFor: '等待 {player}...',

    // 动作
    fold: '弃牌',
    check: '过牌',
    call: '跟注',
    raise: '加注',
    bet: '下注',
    allIn: '全押',

    // 赢家
    winner: '赢家!',
    handComplete: '本局结束',
    won: '赢得',
    chips: '筹码',

    // 加载
    connectingToTable: '正在连接牌桌',
    shufflingDeck: '正在洗牌...',

    // 聊天
    chat: '聊天',
    typeMessage: '输入消息...',
    send: '发送',

    // 扑克术语
    pot: '底池',
    hand: '第 # 手',
    street: '轮次',
    dealer: '庄家',
    you: '你',

    // 通知
    playerJoined: '{player} 加入了牌桌',
    playerLeft: '一位玩家离开了牌桌',
    notEnoughChips: '你需要至少 {amount} 筹码才能玩。',
    confirmLeave: '确定要离开牌桌吗?',
  },

  ja: {
    // 共通
    back: '戻る',
    continue: '続ける',
    cancel: 'キャンセル',
    loading: '読み込み中',
    error: 'エラー',
    success: '成功',

    // ホーム
    home: 'ホーム',
    backToHome: 'ホームに戻る',

    // ロビー
    gameLobby: 'ゲームロビー',
    soloVsAI: 'ソロ対AI',
    multiplayer: 'マルチプレイヤー',
    playAgainstAI: 'AI対戦相手とプレイしてスキルを向上させましょう',
    continueToSoloLobby: 'ソロロビーへ続く',

    // マルチプレイヤー
    quickMatch: 'クイックマッチ',
    browseTables: 'テーブルを閲覧',
    connecting: 'マルチプレイヤーサーバーに接続中...',
    connectionError: 'マルチプレイヤーサーバーに接続できません',
    retryConnection: '接続を再試行',

    // クイックマッチ
    stakes: 'ステークス',
    micro: 'マイクロ',
    low: '低',
    medium: '中',
    high: '高',
    buyIn: 'バイイン',
    buyInAmount: 'バイイン: {amount} チップ',
    findMatch: 'マッチを探す',

    // 検索
    searchingForPlayers: 'プレイヤーを検索中...',
    cancelSearch: '検索をキャンセル',
    matchmakingTip: 'ヒント: マッチメイキングは通常10〜30秒かかります',

    // テーブル
    availableTables: '利用可能なテーブル',
    refresh: '更新',
    noTables: 'テーブルがありません',
    tryQuickMatch: 'クイックマッチを試してください!',
    blinds: 'ブラインド',
    players: 'プレイヤー',
    joinTable: '参加',
    full: '満員',

    // ゲーム
    multiplayerTable: 'マルチプレイヤーテーブル',
    playersOnline: 'オンラインプレイヤー',
    leaveTable: 'テーブルを離れる',
    yourTurn: 'あなたの番',
    waitingFor: '{player}を待っています...',

    // アクション
    fold: 'フォールド',
    check: 'チェック',
    call: 'コール',
    raise: 'レイズ',
    bet: 'ベット',
    allIn: 'オールイン',

    // 勝者
    winner: '勝者!',
    handComplete: 'ハンド完了',
    won: '獲得',
    chips: 'チップ',

    // ロード中
    connectingToTable: 'テーブルに接続中',
    shufflingDeck: 'カードをシャッフル中...',

    // チャット
    chat: 'チャット',
    typeMessage: 'メッセージを入力...',
    send: '送信',

    // ポーカー用語
    pot: 'ポット',
    hand: 'ハンド #',
    street: 'ストリート',
    dealer: 'ディーラー',
    you: 'あなた',

    // 通知
    playerJoined: '{player}がテーブルに参加しました',
    playerLeft: 'プレイヤーがテーブルを離れました',
    notEnoughChips: 'プレイするには少なくとも{amount}チップが必要です。',
    confirmLeave: '本当にテーブルを離れますか？',
  },

  ru: {
    // Общее
    back: 'Назад',
    continue: 'Продолжить',
    cancel: 'Отмена',
    loading: 'Загрузка',
    error: 'Ошибка',
    success: 'Успех',

    // Главная
    home: 'Главная',
    backToHome: 'Вернуться на главную',

    // Лобби
    gameLobby: 'Игровое лобби',
    soloVsAI: 'Соло против ИИ',
    multiplayer: 'Мультиплеер',
    playAgainstAI: 'Играйте против ИИ-противников и улучшайте навыки',
    continueToSoloLobby: 'Продолжить в соло-лобби',

    // Мультиплеер
    quickMatch: 'Быстрая игра',
    browseTables: 'Обзор столов',
    connecting: 'Подключение к серверу мультиплеера...',
    connectionError: 'Не удалось подключиться к серверу мультиплеера',
    retryConnection: 'Повторить подключение',

    // Быстрая игра
    stakes: 'Ставки',
    micro: 'Микро',
    low: 'Низкие',
    medium: 'Средние',
    high: 'Высокие',
    buyIn: 'Бай-ин',
    buyInAmount: 'Бай-ин: {amount} фишек',
    findMatch: 'Найти игру',

    // Поиск
    searchingForPlayers: 'Поиск игроков...',
    cancelSearch: 'Отменить поиск',
    matchmakingTip: 'Совет: Подбор игры обычно занимает 10-30 секунд',

    // Столы
    availableTables: 'Доступные столы',
    refresh: 'Обновить',
    noTables: 'Нет доступных столов',
    tryQuickMatch: 'Попробуйте быструю игру!',
    blinds: 'Блайнды',
    players: 'Игроки',
    joinTable: 'Присоединиться',
    full: 'Заполнен',

    // Игра
    multiplayerTable: 'Мультиплеер стол',
    playersOnline: 'игроков онлайн',
    leaveTable: 'Покинуть стол',
    yourTurn: 'ВАШ ХОД',
    waitingFor: 'Ожидание {player}...',

    // Действия
    fold: 'Сброс',
    check: 'Чек',
    call: 'Колл',
    raise: 'Рейз',
    bet: 'Бет',
    allIn: 'Олл-ин',

    // Победитель
    winner: 'Победитель!',
    handComplete: 'Раздача завершена',
    won: 'Выиграл',
    chips: 'фишек',

    // Загрузка
    connectingToTable: 'Подключение к столу',
    shufflingDeck: 'Тасуем колоду...',

    // Чат
    chat: 'Чат',
    typeMessage: 'Введите сообщение...',
    send: 'Отправить',

    // Покерные термины
    pot: 'БАНК',
    hand: 'Раздача #',
    street: 'Улица',
    dealer: 'Дилер',
    you: 'Вы',

    // Уведомления
    playerJoined: '{player} присоединился к столу',
    playerLeft: 'Игрок покинул стол',
    notEnoughChips: 'Вам нужно минимум {amount} фишек для игры.',
    confirmLeave: 'Вы уверены, что хотите покинуть стол?',
  },

  ar: {
    // عام
    back: 'رجوع',
    continue: 'متابعة',
    cancel: 'إلغاء',
    loading: 'جار التحميل',
    error: 'خطأ',
    success: 'نجاح',

    // الصفحة الرئيسية
    home: 'الصفحة الرئيسية',
    backToHome: 'العودة إلى الصفحة الرئيسية',

    // الردهة
    gameLobby: 'ردهة اللعبة',
    soloVsAI: 'فردي ضد الذكاء الاصطناعي',
    multiplayer: 'متعدد اللاعبين',
    playAgainstAI: 'العب ضد خصوم الذكاء الاصطناعي وحسّن مهاراتك',
    continueToSoloLobby: 'المتابعة إلى الردهة الفردية',

    // متعدد اللاعبين
    quickMatch: 'مباراة سريعة',
    browseTables: 'تصفح الطاولات',
    connecting: 'الاتصال بخادم متعدد اللاعبين...',
    connectionError: 'تعذر الاتصال بخادم متعدد اللاعبين',
    retryConnection: 'إعادة محاولة الاتصال',

    // مباراة سريعة
    stakes: 'الرهانات',
    micro: 'صغيرة جداً',
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
    buyIn: 'الشراء',
    buyInAmount: 'الشراء: {amount} رقاقة',
    findMatch: 'إيجاد مباراة',

    // البحث
    searchingForPlayers: 'البحث عن لاعبين...',
    cancelSearch: 'إلغاء البحث',
    matchmakingTip: 'نصيحة: عادةً ما يستغرق التوفيق 10-30 ثانية',

    // الطاولات
    availableTables: 'الطاولات المتاحة',
    refresh: 'تحديث',
    noTables: 'لا توجد طاولات متاحة',
    tryQuickMatch: 'جرب المباراة السريعة!',
    blinds: 'البلايندز',
    players: 'اللاعبون',
    joinTable: 'انضمام',
    full: 'ممتلئة',

    // اللعبة
    multiplayerTable: 'طاولة متعددة اللاعبين',
    playersOnline: 'لاعبون متصلون',
    leaveTable: 'مغادرة الطاولة',
    yourTurn: 'دورك',
    waitingFor: 'في انتظار {player}...',

    // الإجراءات
    fold: 'انسحاب',
    check: 'تمرير',
    call: 'مجاراة',
    raise: 'رفع',
    bet: 'رهان',
    allIn: 'الكل',

    // الفائز
    winner: 'الفائز!',
    handComplete: 'اكتملت الجولة',
    won: 'فاز بـ',
    chips: 'رقاقة',

    // التحميل
    connectingToTable: 'الاتصال بالطاولة',
    shufflingDeck: 'خلط الأوراق...',

    // الدردشة
    chat: 'الدردشة',
    typeMessage: 'اكتب رسالة...',
    send: 'إرسال',

    // مصطلحات البوكر
    pot: 'الوعاء',
    hand: 'الجولة #',
    street: 'الشارع',
    dealer: 'الموزع',
    you: 'أنت',

    // الإشعارات
    playerJoined: '{player} انضم إلى الطاولة',
    playerLeft: 'غادر لاعب الطاولة',
    notEnoughChips: 'تحتاج إلى {amount} رقاقة على الأقل للعب.',
    confirmLeave: 'هل أنت متأكد من رغبتك في مغادرة الطاولة؟',
  },

  ko: {
    // 공통
    back: '뒤로',
    continue: '계속',
    cancel: '취소',
    loading: '로딩 중',
    error: '오류',
    success: '성공',

    // 홈
    home: '홈',
    backToHome: '홈으로 돌아가기',

    // 로비
    gameLobby: '게임 로비',
    soloVsAI: '솔로 vs AI',
    multiplayer: '멀티플레이어',
    playAgainstAI: 'AI 상대와 플레이하여 실력을 향상시키세요',
    continueToSoloLobby: '솔로 로비로 계속',

    // 멀티플레이어
    quickMatch: '빠른 매치',
    browseTables: '테이블 둘러보기',
    connecting: '멀티플레이어 서버에 연결 중...',
    connectionError: '멀티플레이어 서버에 연결할 수 없습니다',
    retryConnection: '연결 재시도',

    // 빠른 매치
    stakes: '스테이크',
    micro: '마이크로',
    low: '낮음',
    medium: '중간',
    high: '높음',
    buyIn: '바이인',
    buyInAmount: '바이인: {amount} 칩',
    findMatch: '매치 찾기',

    // 검색
    searchingForPlayers: '플레이어 검색 중...',
    cancelSearch: '검색 취소',
    matchmakingTip: '팁: 매치메이킹은 보통 10-30초가 걸립니다',

    // 테이블
    availableTables: '사용 가능한 테이블',
    refresh: '새로고침',
    noTables: '사용 가능한 테이블이 없습니다',
    tryQuickMatch: '빠른 매치를 시도해보세요!',
    blinds: '블라인드',
    players: '플레이어',
    joinTable: '참가',
    full: '가득 참',

    // 게임
    multiplayerTable: '멀티플레이어 테이블',
    playersOnline: '온라인 플레이어',
    leaveTable: '테이블 나가기',
    yourTurn: '당신 차례',
    waitingFor: '{player} 대기 중...',

    // 액션
    fold: '폴드',
    check: '체크',
    call: '콜',
    raise: '레이즈',
    bet: '베팅',
    allIn: '올인',

    // 승자
    winner: '승자!',
    handComplete: '핸드 완료',
    won: '획득',
    chips: '칩',

    // 로딩
    connectingToTable: '테이블에 연결 중',
    shufflingDeck: '카드 섞는 중...',

    // 채팅
    chat: '채팅',
    typeMessage: '메시지를 입력하세요...',
    send: '보내기',

    // 포커 용어
    pot: '팟',
    hand: '핸드 #',
    street: '스트리트',
    dealer: '딜러',
    you: '당신',

    // 알림
    playerJoined: '{player}님이 테이블에 참가했습니다',
    playerLeft: '플레이어가 테이블을 떠났습니다',
    notEnoughChips: '플레이하려면 최소 {amount} 칩이 필요합니다.',
    confirmLeave: '정말로 테이블을 나가시겠습니까?',
  },

  hi: {
    // सामान्य
    back: 'वापस',
    continue: 'जारी रखें',
    cancel: 'रद्द करें',
    loading: 'लोड हो रहा है',
    error: 'त्रुटि',
    success: 'सफलता',

    // होम
    home: 'होम',
    backToHome: 'होम पर वापस जाएं',

    // लॉबी
    gameLobby: 'गेम लॉबी',
    soloVsAI: 'सोलो बनाम AI',
    multiplayer: 'मल्टीप्लेयर',
    playAgainstAI: 'AI प्रतिद्वंद्वियों के खिलाफ खेलें और अपने कौशल में सुधार करें',
    continueToSoloLobby: 'सोलो लॉबी में जारी रखें',

    // मल्टीप्लेयर
    quickMatch: 'त्वरित मैच',
    browseTables: 'टेबल ब्राउज़ करें',
    connecting: 'मल्टीप्लेयर सर्वर से कनेक्ट हो रहा है...',
    connectionError: 'मल्टीप्लेयर सर्वर से कनेक्ट नहीं हो सका',
    retryConnection: 'कनेक्शन पुनः प्रयास करें',

    // त्वरित मैच
    stakes: 'दांव',
    micro: 'माइक्रो',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    buyIn: 'बाय-इन',
    buyInAmount: 'बाय-इन: {amount} चिप्स',
    findMatch: 'मैच खोजें',

    // खोज
    searchingForPlayers: 'खिलाड़ियों की खोज...',
    cancelSearch: 'खोज रद्द करें',
    matchmakingTip: 'सुझाव: मैचमेकिंग में आमतौर पर 10-30 सेकंड लगते हैं',

    // टेबल
    availableTables: 'उपलब्ध टेबल',
    refresh: 'रिफ्रेश करें',
    noTables: 'कोई टेबल उपलब्ध नहीं',
    tryQuickMatch: 'त्वरित मैच आज़माएं!',
    blinds: 'ब्लाइंड्स',
    players: 'खिलाड़ी',
    joinTable: 'शामिल हों',
    full: 'भरा हुआ',

    // खेल
    multiplayerTable: 'मल्टीप्लेयर टेबल',
    playersOnline: 'ऑनलाइन खिलाड़ी',
    leaveTable: 'टेबल छोड़ें',
    yourTurn: 'आपकी बारी',
    waitingFor: '{player} की प्रतीक्षा...',

    // क्रियाएं
    fold: 'फोल्ड',
    check: 'चेक',
    call: 'कॉल',
    raise: 'रेज़',
    bet: 'बेट',
    allIn: 'ऑल-इन',

    // विजेता
    winner: 'विजेता!',
    handComplete: 'हैंड पूर्ण',
    won: 'जीता',
    chips: 'चिप्स',

    // लोडिंग
    connectingToTable: 'टेबल से कनेक्ट हो रहा है',
    shufflingDeck: 'कार्ड फेंटे जा रहे हैं...',

    // चैट
    chat: 'चैट',
    typeMessage: 'संदेश टाइप करें...',
    send: 'भेजें',

    // पोकर शब्द
    pot: 'पॉट',
    hand: 'हैंड #',
    street: 'स्ट्रीट',
    dealer: 'डीलर',
    you: 'आप',

    // सूचनाएं
    playerJoined: '{player} टेबल में शामिल हुए',
    playerLeft: 'एक खिलाड़ी ने टेबल छोड़ दी',
    notEnoughChips: 'खेलने के लिए आपको कम से कम {amount} चिप्स की आवश्यकता है।',
    confirmLeave: 'क्या आप वाकई टेबल छोड़ना चाहते हैं?',
  },
};

// Helper function to get translation with parameter replacement
export function t(lang: Language, key: string, params?: Record<string, string | number>): string {
  let text = (translations[lang] as any)[key] || (translations.en as any)[key] || key;

  if (params) {
    Object.keys(params).forEach(paramKey => {
      text = text.replace(`{${paramKey}}`, String(params[paramKey]));
    });
  }

  return text;
}
