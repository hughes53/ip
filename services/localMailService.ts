// 纯本地邮箱生成服务 - 无需API调用
import type { TempMailMessage, MailEvent } from "@/app/types";

// 固定域名池 - 指定的6个域名
const FIXED_DOMAINS = [
  "139.run",
  "vod365.com",
  "pda315.com", 
  "10086hy.com",
  "kelianbao.com",
  "eattea.uk"
];

// 有意义的英文单词池（仅2-3个字符）
const WORD_POOL = [
  // 2个字符的有意义单词
  "ai", "an", "as", "at", "be", "by", "do", "go", "he", "hi", "if", "in", "is", "it", "me", "my", "no", "of", "ok", "on", "or", "so", "to", "up", "us", "we",
  // 3个字符的有意义单词
  "ace", "act", "add", "age", "aid", "aim", "air", "all", "and", "any", "app", "are", "arm", "art", "ask", "bad", "bag", "bar", "bat", "bay", "bed", "bee", "bet", "big", "bit", "box", "boy", "bug", "bus", "but", "buy", "can", "car", "cat", "cup", "cut", "day", "did", "die", "dog", "dot", "dry", "ear", "eat", "egg", "end", "eye", "far", "fat", "few", "fly", "for", "fox", "fun", "get", "god", "got", "gun", "guy", "had", "has", "hat", "her", "him", "his", "hit", "hot", "how", "ice", "job", "joy", "key", "kid", "law", "lay", "leg", "let", "lie", "lot", "low", "mad", "man", "map", "max", "may", "mix", "mom", "new", "now", "odd", "off", "old", "one", "our", "out", "own", "pay", "pen", "pet", "pic", "pie", "pop", "put", "ran", "red", "run", "sad", "say", "sea", "see", "set", "she", "shy", "sit", "six", "sky", "sun", "tea", "ten", "the", "top", "toy", "try", "two", "use", "van", "war", "was", "way", "web", "who", "why", "win", "yes", "yet", "you", "zoo"
];

/**
 * 纯本地邮箱生成服务类 - 无需API调用，纯前端生成
 */
export class LocalMailService {
  private currentEmail: string = "";
  private currentDomain: string = "";

  constructor() {
    // 纯本地邮箱生成服务已初始化
  }

  /**
   * 生成有意义的随机用户名（2-3个字符的纯英文单词）
   * @returns 有意义的纯单词用户名
   */
  private generateMeaningfulUsername(): string {
    const word = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    return word;
  }

  /**
   * 从固定域名池中随机选择一个域名
   * @returns 随机选择的域名
   */
  private getRandomDomain(): string {
    return FIXED_DOMAINS[Math.floor(Math.random() * FIXED_DOMAINS.length)];
  }

  /**
   * 生成完整的邮箱地址
   * @returns 生成的邮箱地址
   */
  generateEmail(): string {
    const username = this.generateMeaningfulUsername();
    const domain = this.getRandomDomain();
    const email = `${username}@${domain}`;
    
    this.currentEmail = email;
    this.currentDomain = domain;

    return email;
  }

  /**
   * 获取当前邮箱地址
   * @returns 当前邮箱地址
   */
  getCurrentEmail(): string {
    return this.currentEmail;
  }

  /**
   * 获取可用域名列表
   * @returns 固定域名数组
   */
  getAvailableDomains(): string[] {
    return [...FIXED_DOMAINS];
  }

  /**
   * 模拟邮件列表（暂时返回空数组）
   * @returns 空的邮件数组
   */
  getMessages(): TempMailMessage[] {
    return [];
  }

  /**
   * 清理资源（无需实际操作）
   */
  destroy(): void {
    // 清理本地邮箱服务资源
  }
}

// 创建单例实例
export const localMailService = new LocalMailService();
