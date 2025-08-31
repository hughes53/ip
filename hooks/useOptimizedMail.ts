import { useState, useEffect } from "react";
import { optimizedMailService } from "@/services/mailService";
import type { TempMailMessage, MailEvent } from "@/app/types";

interface UseOptimizedMailReturn {
  tempEmail: string;
  emailLoading: boolean;
  messages: TempMailMessage[];
  selectedMessage: TempMailMessage | null;
  toastMessage: TempMailMessage | null;
  setSelectedMessage: (message: TempMailMessage | null) => void;
  setToastMessage: (message: TempMailMessage | null) => void;
  handleMessageClick: (msg: TempMailMessage) => Promise<void>;
  // 优化版特有属性
  availableDomains: string[];
  refreshMessages: () => Promise<void>;
}

export default function useOptimizedMail(): UseOptimizedMailReturn {
  console.log("🚀 优化版邮箱服务初始化");
  console.log("📦 optimizedMailService:", optimizedMailService);

  const [tempEmail, setTempEmail] = useState<string>("");
  const [emailLoading, setEmailLoading] = useState(true);
  const [messages, setMessages] = useState<TempMailMessage[]>([]);

  console.log("📧 当前 tempEmail 状态:", tempEmail);
  const [selectedMessage, setSelectedMessage] = useState<TempMailMessage | null>(null);
  const [toastMessage, setToastMessage] = useState<TempMailMessage | null>(null);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 确保客户端水合后再获取域名
  useEffect(() => {
    setIsClient(true);
    setAvailableDomains(optimizedMailService.getAvailableDomains());
  }, []);

  useEffect(() => {
    console.log("🔄 useEffect 被触发");
    console.log("📧 当前 tempEmail:", tempEmail);
    console.log("🌐 isClient:", isClient);
    console.log("🪟 window 类型:", typeof window);

    const createTempEmail = async () => {
      setEmailLoading(true);
      try {
        console.log("🚀 开始创建优化邮箱账户...");
        const account = await optimizedMailService.createOneAccount();
        
        if (account.status) {
          console.log("✅ 邮箱账户创建成功:", account.data.username);
          console.log("🔧 设置 tempEmail 为:", account.data.username);
          setTempEmail(account.data.username);
          
          // 登录获取token
          const loginResult = await optimizedMailService.login(
            account.data.username, 
            account.data.password
          );
          
          if (loginResult.status) {
            console.log("✅ 邮箱登录成功");
            
            // 设置事件监听
            optimizedMailService.on("arrive", async (message: MailEvent) => {
              console.log("📧 收到新邮件:", message);
              try {
                const fullMessage = await optimizedMailService.getMessage(message.id);
                if (fullMessage.status) {
                  const source = await optimizedMailService.getSource(message.id);
                  const messageData = {
                    ...fullMessage.data,
                    source: source.status ? {
                      id: source.data.id,
                      data: source.data.data,
                      downloadUrl: source.data.downloadUrl,
                    } : undefined,
                  } as TempMailMessage;
                  
                  setMessages((prev) => [...prev, messageData]);
                  setToastMessage(messageData);
                }
              } catch (error) {
                console.error("处理新邮件失败:", error);
              }
            });

            optimizedMailService.on("open", () => {
              console.log("🔗 邮件事件监听已启动");
            });

            optimizedMailService.on("error", (error) => {
              console.error("❌ 邮件事件监听错误:", error);
            });
            
          } else {
            console.error("❌ 邮箱登录失败:", loginResult.message);
          }
        } else {
          console.error("❌ 邮箱账户创建失败:", account.message);
        }
      } catch (error) {
        console.error("❌ 创建临时邮箱失败:", error);
      } finally {
        setEmailLoading(false);
      }
    };

    console.log("🔍 条件检查:");
    console.log("  - !tempEmail:", !tempEmail);
    console.log("  - isClient:", isClient);
    console.log("  - 条件满足:", !tempEmail && isClient);

    if (!tempEmail && isClient) {
      console.log("✅ 条件满足，开始创建邮箱");
      console.log("🎯 准备创建纯单词邮箱，当前 tempEmail:", tempEmail);
      createTempEmail();
    } else {
      console.log("❌ 条件不满足，跳过邮箱创建");
    }

    // 清理函数
    return () => {
      optimizedMailService.destroy();
    };
  }, [tempEmail, isClient]);

  const handleMessageClick = async (msg: TempMailMessage) => {
    if (!msg.source) {
      try {
        const fullMessage = await optimizedMailService.getMessage(msg.id);
        if (fullMessage.status) {
          const source = await optimizedMailService.getSource(msg.id);
          const messageData = {
            ...fullMessage.data,
            source: source.status ? {
              id: source.data.id,
              data: source.data.data,
              downloadUrl: source.data.downloadUrl,
            } : undefined,
          } as TempMailMessage;
          
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? messageData : m))
          );
          setSelectedMessage(messageData);
        }
      } catch (error) {
        console.error("获取邮件内容失败:", error);
      }
    } else {
      setSelectedMessage(msg);
    }
  };

  const refreshMessages = async () => {
    try {
      const result = await optimizedMailService.getMessages();
      if (result.status) {
        setMessages(result.data.messages);
      }
    } catch (error) {
      console.error("刷新邮件列表失败:", error);
    }
  };

  return {
    tempEmail,
    emailLoading,
    messages,
    selectedMessage,
    toastMessage,
    availableDomains,
    setSelectedMessage,
    setToastMessage,
    handleMessageClick,
    refreshMessages,
  };
}
