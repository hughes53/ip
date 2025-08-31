// 纯本地邮箱生成服务 - 无需API调用
import axios from "axios";
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

export interface MailAccount {
  username: string;
  password: string;
  token?: string;
  id?: string;
}

export interface MailResponse<T = any> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

class OptimizedMailService {
  private baseUrl = "https://api.mail.tm";
  private token: string | null = null;
  private accountId: string | null = null;
  private eventSource: EventSource | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  /**
   * 生成有意义的随机用户名（2-3个字符的纯英文单词）
   * @returns 有意义的纯单词用户名
   */
  private generateMeaningfulUsername(): string {
    // 直接从单词池中随机选择一个单词（2-3个字符）
    const word = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    return word;
  }

  /**
   * 生成随机密码
   * @param length 密码长度，默认12位
   * @returns 随机密码字符串
   */
  private generateRandomPassword(length: number = 12): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 从固定域名池中随机选择一个域名
   * @returns 随机选择的域名
   */
  private getRandomDomain(): string {
    return FIXED_DOMAINS[Math.floor(Math.random() * FIXED_DOMAINS.length)];
  }

  /**
   * 创建随机邮箱账户 - 优化版本，使用固定域名池
   * @returns Promise<MailResponse<MailAccount>>
   */
  async createOneAccount(): Promise<MailResponse<MailAccount>> {
    const username = this.generateMeaningfulUsername();
    const domain = this.getRandomDomain();
    const email = `${username}@${domain}`;
    const password = this.generateRandomPassword();

    try {

      console.log("🎯 创建纯单词邮箱账户:");
      console.log("👤 纯单词用户名:", username);
      console.log("📧 完整邮箱:", email);
      console.log("🌐 固定域名:", domain);
      console.log("🔑 密码:", password);

      // 创建账户
      const response = await axios.post(`${this.baseUrl}/accounts`, {
        address: email,
        password: password
      });

      if (response.status === 201) {
        return {
          status: true,
          statusCode: 201,
          message: "Account created successfully",
          data: {
            username: email,
            password: password
          }
        };
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error: any) {
      console.error("🚨🚨🚨 邮箱创建失败 🚨🚨🚨");
      console.error("📊 HTTP状态码:", error.response?.status);
      console.error("📝 服务器错误信息:", JSON.stringify(error.response?.data, null, 2));
      console.error("🔍 错误消息:", error.message);
      console.error("🌐 请求URL:", `${this.baseUrl}/accounts`);
      console.error("📧 尝试创建的邮箱:", email);
      console.error("🌐 使用的域名:", domain);

      return {
        status: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to create account",
        data: {} as MailAccount
      };
    }
  }

  /**
   * 登录邮箱账户
   * @param email 邮箱地址
   * @param password 密码
   * @returns Promise<MailResponse<{token: string, id: string}>>
   */
  async login(email: string, password: string): Promise<MailResponse<{token: string, id: string}>> {
    try {
      const response = await axios.post(`${this.baseUrl}/token`, {
        address: email,
        password: password
      });

      if (response.status === 200) {
        this.token = response.data.token;
        this.accountId = response.data.id;
        
        return {
          status: true,
          statusCode: 200,
          message: "Login successful",
          data: {
            token: response.data.token,
            id: response.data.id
          }
        };
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error: any) {
      console.error("登录失败:", error);
      return {
        status: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Login failed",
        data: {} as {token: string, id: string}
      };
    }
  }

  /**
   * 获取邮件列表
   * @param page 页码，默认1
   * @returns Promise<MailResponse<{messages: TempMailMessage[]}>>
   */
  async getMessages(page: number = 1): Promise<MailResponse<{messages: TempMailMessage[]}>> {
    if (!this.token) {
      return {
        status: false,
        statusCode: 401,
        message: "Not authenticated",
        data: {messages: []}
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/messages?page=${page}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      return {
        status: true,
        statusCode: 200,
        message: "Messages retrieved successfully",
        data: {
          messages: response.data["hydra:member"] || []
        }
      };
    } catch (error: any) {
      console.error("获取邮件列表失败:", error);
      return {
        status: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to get messages",
        data: {messages: []}
      };
    }
  }

  /**
   * 获取单个邮件详情
   * @param messageId 邮件ID
   * @returns Promise<MailResponse<TempMailMessage>>
   */
  async getMessage(messageId: string): Promise<MailResponse<TempMailMessage>> {
    if (!this.token) {
      return {
        status: false,
        statusCode: 401,
        message: "Not authenticated",
        data: {} as TempMailMessage
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      return {
        status: true,
        statusCode: 200,
        message: "Message retrieved successfully",
        data: response.data
      };
    } catch (error: any) {
      console.error("获取邮件详情失败:", error);
      return {
        status: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to get message",
        data: {} as TempMailMessage
      };
    }
  }

  /**
   * 获取邮件源码
   * @param messageId 邮件ID
   * @returns Promise<MailResponse<{id: string, data: string, downloadUrl: string}>>
   */
  async getSource(messageId: string): Promise<MailResponse<{id: string, data: string, downloadUrl: string}>> {
    if (!this.token) {
      return {
        status: false,
        statusCode: 401,
        message: "Not authenticated",
        data: {id: "", data: "", downloadUrl: ""}
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/sources/${messageId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      return {
        status: true,
        statusCode: 200,
        message: "Source retrieved successfully",
        data: response.data
      };
    } catch (error: any) {
      console.error("获取邮件源码失败:", error);
      return {
        status: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Failed to get source",
        data: {id: "", data: "", downloadUrl: ""}
      };
    }
  }

  /**
   * 监听邮件事件
   * @param event 事件类型
   * @param callback 回调函数
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);

    // 如果是第一次监听且有token，启动SSE连接
    if (this.token && this.accountId && !this.eventSource) {
      this.startEventSource();
    }
  }

  /**
   * 移除事件监听
   * @param event 事件类型，可选
   * @param callback 回调函数，可选
   */
  off(event?: string, callback?: Function): void {
    if (event && callback) {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else if (event) {
      this.eventListeners.delete(event);
    } else {
      this.eventListeners.clear();
      this.stopEventSource();
    }
  }

  /**
   * 启动SSE事件监听
   */
  private startEventSource(): void {
    if (!this.token || !this.accountId) return;

    try {
      const url = `https://mercure.mail.tm/.well-known/mercure?topic=/accounts/${this.accountId}`;
      this.eventSource = new EventSource(url, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      } as any);

      this.eventSource.onopen = () => {
        this.emit("open", "Event source connected");
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // 根据消息类型触发相应事件
          if (data.type === "message") {
            this.emit("arrive", data);
          }
        } catch (error) {
          console.error("解析SSE消息失败:", error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("SSE连接错误:", error);
        this.emit("error", error);
      };
    } catch (error) {
      console.error("启动SSE连接失败:", error);
    }
  }

  /**
   * 停止SSE事件监听
   */
  private stopEventSource(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  /**
   * 触发事件
   * @param event 事件类型
   * @param data 事件数据
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`事件回调执行失败 (${event}):`, error);
        }
      });
    }
  }

  /**
   * 获取当前使用的域名列表
   * @returns 固定域名数组
   */
  getAvailableDomains(): string[] {
    return [...FIXED_DOMAINS];
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.off();
    this.token = null;
    this.accountId = null;
  }
}

export const optimizedMailService = new OptimizedMailService();
