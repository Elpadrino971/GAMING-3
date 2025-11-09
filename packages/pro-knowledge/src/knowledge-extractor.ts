import OpenAI from 'openai';

/**
 * Source de connaissance à extraire
 */
export interface KnowledgeSource {
  type: 'video' | 'article' | 'book' | 'interview';
  url?: string;
  title: string;
  author: string;
  content: string; // Transcript ou texte
}

/**
 * Conseil extrait
 */
export interface ExtractedTip {
  title: string;
  content: string;
  category: string;
  situation: string;
  difficulty: number; // 1-5
  source: string;
  confidence: number; // 0-1
}

/**
 * Classe pour extraire des conseils depuis différentes sources
 */
export class KnowledgeExtractor {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Extrait des tips depuis une source de connaissance
   */
  async extractTips(source: KnowledgeSource, proName: string): Promise<ExtractedTip[]> {
    const prompt = `
You are a poker knowledge extractor. Analyze the following content from ${proName} and extract actionable poker tips.

SOURCE TYPE: ${source.type}
TITLE: ${source.title}
CONTENT:
${source.content.slice(0, 8000)} // Limiter pour rester dans la limite de tokens

Extract up to 10 high-quality, actionable poker tips. For each tip:
1. Create a catchy title (max 60 chars)
2. Write detailed content (2-4 sentences explaining the concept)
3. Categorize it (PRE_FLOP, POST_FLOP, BLUFFING, VALUE_BETTING, POSITION, RANGE_READING, BANKROLL, TOURNAMENT, CASH_GAME, MENTAL_GAME, PHYSICAL_TELLS, ICM)
4. Describe the situation where it applies
5. Rate difficulty (1=beginner, 2=intermediate, 3=advanced, 4=expert, 5=world-class)

Respond in JSON format as an array of tips.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert poker analyst specialized in extracting actionable tips from poker content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) return [];

      const parsed = JSON.parse(response);
      const tips = parsed.tips || [];

      return tips.map((tip: any) => ({
        ...tip,
        source: `${source.title} - ${source.author}`,
        confidence: 0.85 // Base confidence for GPT-4 extraction
      }));
    } catch (error) {
      console.error('Error extracting tips:', error);
      return [];
    }
  }

  /**
   * Extrait des tips depuis une transcription YouTube
   */
  async extractFromYouTubeTranscript(
    transcript: string,
    videoTitle: string,
    proName: string
  ): Promise<ExtractedTip[]> {
    return this.extractTips(
      {
        type: 'video',
        title: videoTitle,
        author: proName,
        content: transcript
      },
      proName
    );
  }

  /**
   * Extrait des tips depuis un article de blog
   */
  async extractFromArticle(
    articleContent: string,
    articleTitle: string,
    author: string
  ): Promise<ExtractedTip[]> {
    return this.extractTips(
      {
        type: 'article',
        title: articleTitle,
        author: author,
        content: articleContent
      },
      author
    );
  }

  /**
   * Extrait des tips depuis un livre (chunk par chunk)
   */
  async extractFromBook(
    bookChapter: string,
    bookTitle: string,
    author: string,
    chapterName: string
  ): Promise<ExtractedTip[]> {
    return this.extractTips(
      {
        type: 'book',
        title: `${bookTitle} - ${chapterName}`,
        author: author,
        content: bookChapter
      },
      author
    );
  }

  /**
   * Génère des tips synthétiques basés sur le style d'un pro
   */
  async generateSyntheticTips(
    proName: string,
    playStyle: string,
    specialty: string[],
    existingTips: ExtractedTip[],
    count: number = 5
  ): Promise<ExtractedTip[]> {
    const existingTitles = existingTips.map(t => t.title).join(', ');

    const prompt = `
You are ${proName}, a professional poker player known for ${playStyle} style and expertise in ${specialty.join(', ')}.

Generate ${count} NEW poker tips that:
1. Reflect your unique playing style and philosophy
2. Are different from these existing tips: ${existingTitles}
3. Cover various aspects of poker strategy
4. Are actionable and specific

For each tip, provide:
- title: Catchy title (max 60 chars)
- content: Detailed explanation (2-4 sentences)
- category: One of (PRE_FLOP, POST_FLOP, BLUFFING, VALUE_BETTING, POSITION, RANGE_READING, BANKROLL, TOURNAMENT, CASH_GAME, MENTAL_GAME, PHYSICAL_TELLS, ICM)
- situation: When to apply this tip
- difficulty: 1-5 (1=beginner to 5=world-class)

Respond in JSON format with an array of tips.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are ${proName}, creating poker tips in your unique voice and style.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) return [];

      const parsed = JSON.parse(response);
      const tips = parsed.tips || [];

      return tips.map((tip: any) => ({
        ...tip,
        source: `${proName} AI-Generated`,
        confidence: 0.75 // Slightly lower confidence for synthetic tips
      }));
    } catch (error) {
      console.error('Error generating synthetic tips:', error);
      return [];
    }
  }

  /**
   * Catégorise automatiquement un conseil
   */
  async categorizeTip(tipContent: string): Promise<string> {
    const categories = [
      'PRE_FLOP',
      'POST_FLOP',
      'BLUFFING',
      'VALUE_BETTING',
      'POSITION',
      'RANGE_READING',
      'BANKROLL',
      'TOURNAMENT',
      'CASH_GAME',
      'MENTAL_GAME',
      'PHYSICAL_TELLS',
      'ICM'
    ];

    const prompt = `
Categorize this poker tip into ONE of these categories: ${categories.join(', ')}

TIP: ${tipContent}

Respond with just the category name.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 20
      });

      const category = completion.choices[0].message.content?.trim().toUpperCase();
      return categories.includes(category || '') ? category! : 'GENERAL';
    } catch (error) {
      return 'GENERAL';
    }
  }

  /**
   * Évalue la difficulté d'un conseil (1-5)
   */
  async evaluateDifficulty(tipContent: string): Promise<number> {
    const prompt = `
Rate the difficulty of this poker tip on a scale of 1-5:
1 = Beginner (basic concepts)
2 = Intermediate (requires some experience)
3 = Advanced (for experienced players)
4 = Expert (complex strategic concepts)
5 = World-class (cutting-edge theory)

TIP: ${tipContent}

Respond with just a number (1-5).
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10
      });

      const difficulty = parseInt(completion.choices[0].message.content?.trim() || '2');
      return Math.max(1, Math.min(5, difficulty)); // Clamp entre 1 et 5
    } catch (error) {
      return 2; // Default to intermediate
    }
  }

  /**
   * Combine plusieurs tips similaires en un seul conseil plus complet
   */
  async mergeSimilarTips(tips: ExtractedTip[]): Promise<ExtractedTip> {
    const combinedContent = tips.map(t => `- ${t.title}: ${t.content}`).join('\n');

    const prompt = `
These poker tips are related. Merge them into ONE comprehensive, well-written tip:

${combinedContent}

Create a merged tip with:
- title: A clear, catchy title
- content: Comprehensive explanation combining all insights (3-5 sentences)
- category: Most appropriate category
- situation: When to apply this merged advice
- difficulty: Average difficulty level

Respond in JSON format.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) return tips[0];

      const merged = JSON.parse(response);
      return {
        ...merged,
        source: tips.map(t => t.source).join(', '),
        confidence: Math.max(...tips.map(t => t.confidence))
      };
    } catch (error) {
      console.error('Error merging tips:', error);
      return tips[0];
    }
  }

  /**
   * Vérifie si un tip est de haute qualité
   */
  isHighQuality(tip: ExtractedTip): boolean {
    // Critères de qualité
    const hasGoodLength = tip.content.length >= 100 && tip.content.length <= 500;
    const hasGoodTitle = tip.title.length >= 10 && tip.title.length <= 60;
    const hasCategory = tip.category && tip.category !== 'GENERAL';
    const hasSituation = tip.situation && tip.situation.length > 10;
    const hasConfidence = tip.confidence >= 0.7;

    return hasGoodLength && hasGoodTitle && hasCategory && hasSituation && hasConfidence;
  }

  /**
   * Filtre les tips pour ne garder que les meilleurs
   */
  filterHighQualityTips(tips: ExtractedTip[]): ExtractedTip[] {
    return tips
      .filter(tip => this.isHighQuality(tip))
      .sort((a, b) => b.confidence - a.confidence);
  }
}

/**
 * Utilitaires pour scraper des sources externes
 */
export class SourceScraper {
  /**
   * Simule l'extraction d'une transcription YouTube
   * En production, utiliser youtube-transcript ou similar-youtube-transcript
   */
  async fetchYouTubeTranscript(videoId: string): Promise<string> {
    // TODO: Implémenter avec youtube-transcript package
    // const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    // return transcript.map(t => t.text).join(' ');
    throw new Error('YouTube transcript extraction not implemented. Install youtube-transcript package.');
  }

  /**
   * Scrape un article de blog
   * En production, utiliser cheerio + puppeteer
   */
  async scrapeArticle(url: string): Promise<{ title: string; content: string; author: string }> {
    // TODO: Implémenter avec cheerio/puppeteer
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.goto(url);
    // const content = await page.evaluate(() => document.body.innerText);
    throw new Error('Article scraping not implemented. Install cheerio/puppeteer.');
  }

  /**
   * Parse un fichier PDF de livre
   */
  async parseBookPDF(pdfPath: string): Promise<string> {
    // TODO: Implémenter avec pdf-parse
    // const dataBuffer = fs.readFileSync(pdfPath);
    // const data = await pdf(dataBuffer);
    // return data.text;
    throw new Error('PDF parsing not implemented. Install pdf-parse package.');
  }
}
